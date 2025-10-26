<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class AuthController extends Controller
{
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
            'emergency_contact' => 'nullable|string|max:15',
            'role' => 'required|in:Patient,Collaborateur',
            'speciality' => 'required_if:role,Collaborateur|string|max:255',
            'license_number' => 'required_if:role,Collaborateur|string|max:255',
            'workplace' => 'required_if:role,Collaborateur|string|max:255',
            'isAvailable' => 'required_if:role,Collaborateur|boolean',
            'availability' => 'required_if:isAvailable,true|nullable|string|max:255',
        ]);

        $user = User::create([
            'id' => Str::uuid(),
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->profile()->create([
            'id' => Str::uuid(),
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'phone' => $request->phone,
            'address' => $request->address,
            'date_birth' => $request->date_birth,
            'gender' => $request->gender,
            'emergency_contact' => $request->filled('emergency_contact') ? $request->emergency_contact : null,
        ]);

        $role = $request->role;
        Role::firstOrCreate(['name' => $role]);
        $user->assignRole($role);

        if ($role === 'Patient') {
            $user->patient()->create([
                'id' => Str::uuid(),
                'urgencyNumber' => 'URG-' . strtoupper(Str::random(8)),  // Add unique urgency number
            ]);
        } elseif ($role === 'Collaborateur') {
            $user->collaborator()->create([
                'speciality' => $request->speciality,
                'license_number' => $request->license_number,
                'workplace' => $request->workplace,
                'isAvailable' => $request->isAvailable ?? false,
                'availability' => $request->isAvailable ? $request->availability : null,
                'rating' => 0,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $relations = ['profile'];
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
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'remember' => 'boolean',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect',
            ], 401);
        }
        $user->last_login_at = now();
        $user->save(); //  Save in the database

        $expiration = $request->remember ? now()->addMonth() : now()->addDay();

        $token = $user->createToken('auth_Token', ['*'], $expiration)->plainTextToken;

        $role = $user->getRoleNames()->first();

        return response()->json([
            'access_token' => $token,
            'role' => $role,
            'user' => $user->load(['profile', 'patient', 'collaborator']),
        ]);
    }

    public function logout(Request $request)
    {
        $user = Auth::user();

        if ($user) {
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
            'emergency_contact' => 'sometimes|nullable|string|max:15',

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
