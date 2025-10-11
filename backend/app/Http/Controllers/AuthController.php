<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

class AuthController extends Controller
{
    // Enregistrement
    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|unique:users,email|max:255',
            'password' => 'required|string|min:8|confirmed',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:15',
            'address' => 'required|string|max:255',
            'date_birth' => 'required|date',
            'gender' => 'required|string|in:male,female',
            'urgency_number' => 'nullable|string|max:15',
            'role' => 'required|in:Patient,Collaborateur',
            'speciality' => 'required_if:role,Collaborateur|string|max:255',
            'license_number' => 'required_if:role,Collaborateur|string|max:255',
            'workplace' => 'required_if:role,Collaborateur|string|max:255',
            'is_available' => 'required_if:role,Collaborateur|boolean',
            'availability' => 'required_if:is_available,true|nullable|string|max:255',
        ]);

        // 1. Création du user
        $user = User::create([
            'id' => Str::uuid(),
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // 2. Création du profile
        $user->profile()->create([
            'id' => Str::uuid(),
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'phone' => $request->phone,
            'address' => $request->address,
            'date_birth' => $request->date_birth,
            'gender' => $request->gender,
            'urgency_number' => $request->filled('urgency_number') ? $request->urgency_number : null,
        ]);

        // 3. Assigner le rôle
        $role = $request->role;
        Role::firstOrCreate(['name' => $role]);
        $user->assignRole($role);

        // 4. Create role-specific relation
        if ($role === 'Patient') {
            $user->patient()->create([]);
        } elseif ($role === 'Collaborateur') {
            $user->collaborator()->create([
                'speciality' => $request->speciality,
                'license_number' => $request->license_number,
                'workplace' => $request->workplace,
                'is_available' => $request->is_available ?? false,
                'availability' => $request->is_available ? $request->availability : null,
                'rating' => 0,
            ]);
        }

        // 5. Création du token
        $token = $user->createToken('auth_token')->plainTextToken;

        // 6. Dynamically load relations
        $relations = ['profile']; // Always load profile
        if ($role === 'Patient') {
            $relations[] = 'patient';
        }
        if ($role === 'Collaborateur') {
            $relations[] = 'collaborator';
        }

        return response()->json([
            'access_token' => $token,
            'user' => $user->load($relations),
            'role' => $role,
        ]);
    }

    public function login(Request $request)
    {
        // Validate the request data
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Attempt to authenticate the user with the provided credentials
        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages(['message' => ['The provided credentials are incorrect.']]);
        }

        // Get the authenticated user
        $user = User::where('email', $request->email)->firstOrFail();

        // Mettre à jour last_login ici
        $user->last_login_at = now();
        $user->save();

        // Create a token for the user
        $token = $user->createToken('auth_Token')->plainTextToken;

        // Retrieve the role of the user (e.g., 'Patient', 'Collaborateur')
        $role = $user->getRoleNames()->first();  // Assuming you are using Spatie roles

        // Return the response with token, role, and other necessary data
        return response()->json([
            'access_token' => $token,             // The authentication token
            'role' => $role,                      // The role of the user (e.g., Patient or Collaborator)
            'user' => $user->load(['profile', 'patient', 'collaborator']),  // Load the related models
            // 'profile' => optional($user->profile),  // Include the profile, if exists
            // 'patient' => optional($user->patient),  // Include patient details, if exists
            // 'collaborator' => optional($user->collaborator),  // Include collaborator details, if exists
        ]);
    }

    // Logout
    // public function logout(Request $request)
    // {
    //     // Delete all tokens of the authenticated user
    //     Auth::user()->tokens->each(function ($token) {
    //         $token->delete();
    //     });

    //     // Return a JSON response
    //     return response()->json([
    //         'message' => 'Déconnexion réussie',
    //     ]);
    // }
    public function logout(Request $request)
    {
        $user = Auth::user(); // Get the currently authenticated user

        if ($user) {
            // Delete only the token used in this request
            /** @var \Laravel\Sanctum\PersonalAccessToken $token */
            $token = $user->currentAccessToken();
            $token->delete();

            return response()->json([
                'message' => 'Déconnexion réussie',
            ]);
        }

        return response()->json([
            'message' => 'Utilisateur non authentifié',
        ], 401);
    }

    // Get Authenticated User
    // In AuthController
    public function me(Request $request)
    {
        $user = $request->user(); // Get the authenticated user

        // Return basic user data along with the profile and role
        return response()->json([
            'id' => $user->id,
            'email' => $user->email,
            'role' => $user->getRoleNames()->first(), // Only the first role (assuming single role)
            'profile' => $user->profile,  // Profile information
            'patient' => $user->patient,  // Patient-specific info (if exists)
            'collaborator' => $user->collaborator,  // Collaborator-specific info (if exists)
        ]);
    }

    // Update Profile
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'sometimes|string|min:6|confirmed',
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:255',
            'date_birth' => 'sometimes|date|before:today',
            // Optional fields
            'urgency_number' => 'sometimes|nullable|string|max:15',

            // For collaborators
            'speciality' => 'sometimes|required_if:role,Collaborateur|string|max:255',
            'license_number' => 'sometimes|required_if:role,Collaborateur|string|max:255',
            'workplace' => 'sometimes|required_if:role,Collaborateur|string|max:255',
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Profil modifié avec succès',
            'user' => $user->load(['profile', 'patient', 'collaborator']),
        ]);
    }
}