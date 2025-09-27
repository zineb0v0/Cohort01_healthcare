<?php

namespace App\Http\Controllers\API;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\User;
use App\Models\Patient;
use App\Models\Collaborator;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;



class AuthController extends Controller
{
    // Enregistrement
/*
    public function register(Request $request)
    {
        // Validation des champs
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'date_birth' => 'nullable|date',
            'gender' => 'nullable|string|in:male,female,other',
            'emergency_contact' => 'nullable|string|max:20',
            'role' => 'required|in:Patient,Collaborateur',
            'urgency_number' => 'required_if:role,Patient|string|max:20', // specific au patient mais non required
            'speciality' => 'required_if:role,Collaborateur|string|max:255', // Required if role is Collaborateur
            'licenseNumber' => 'required_if:role,Collaborateur|string|max:255',
            'workplace' => 'required_if:role,Collaborateur|string|max:255',
        ]);

        $user = User::create([
            'id' => Str::uuid(), // uniquement si 'id' est UUID dans la table
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Création du Profile lié au User
        $user->profile()->create([
            'id' => Str::uuid(),
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'phone' => $request->phone,
            'address' => $request->address,
            'date_birth' => $request->date_birth,
            'gender' => $request->gender,
            'emergency_contact' => $request->emergency_contact,
        ]);

        // Assigner le rôle
        $role = $request->role;
        Role::firstOrCreate(['name' => $role]);
        $user->assignRole($role);


         //  Si Patient
        if ($role === 'Patient') {
            $user->patient()->create([
                'urgency_number' => $request->urgency_number ?? null,
            ]);
        }

        // Si Collaborateur
        if ($role === 'Collaborateur') {
            $user->collaborator()->create([
                'speciality' => $request->speciality,
                'licenseNumber' => $request->licenseNumber,
                'workplace' => $request->workplace,
            ]);
        }


        // Création du token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('profile'), // inclut le profile dans la réponse
        ]);
    }
*/
public function register(Request $request)
{
    try {
        // Validation des champs
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'date_birth' => 'nullable|date',
            'gender' => 'nullable|string|in:male,female,other',
            'emergency_contact' => 'nullable|string|max:20',
            'role' => 'required|in:Patient,Collaborateur',
            'urgency_number' => 'required_if:role,Patient|string|max:20',
            'speciality' => 'required_if:role,Collaborateur|string|max:255',
            'licenseNumber' => 'required_if:role,Collaborateur|string|max:255',
            'workplace' => 'required_if:role,Collaborateur|string|max:255',
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
            'emergency_contact' => $request->emergency_contact,
        ]);

        // Assigner le rôle
        $role = $request->role;
        Role::firstOrCreate(['name' => $role]);
        $user->assignRole($role);

        if ($role === 'Patient') {
            $user->patient()->create([
                'urgency_number' => $request->urgency_number ?? null,
            ]);
        }

        if ($role === 'Collaborateur') {
            $user->collaborator()->create([
                'speciality' => $request->speciality,
                'licenseNumber' => $request->licenseNumber,
                'workplace' => $request->workplace,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('profile'),
        ]);
    } catch (\Exception $e) {
        // Log the error with full details
        Log::error('User registration failed', [
            'error' => $e->getMessage(),
            'stack' => $e->getTraceAsString(),
            'request_data' => $request->all(),
        ]);

        return response()->json([
            'message' => 'Registration failed, check logs for details',
        ], 500);
    }
}
   
    // Login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.']
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->getRoleNames(),
                'profile' => $user->profile,
                'patient' => $user->patient,
                'collaborator' => $user->collaborator,
            ],
        ]);
    }

    // Logout
    public function logout(Request $request)
    {
        $token = $request->user()->currentAccessToken();
        if ($token) {
            $token->delete();
        }

        return response()->json(['message' => 'Successfully logged out']);
    }

    // Get Authenticated User
    public function me(Request $request)
    {
        return response()->json([
            'id' => $request->user()->id,
            'email' => $request->user()->email,
            'role' => $request->user()->getRoleNames(),
            'profile' => $request->user()->profile,
            'patient' => $request->user()->patient,
            'collaborator' => $request->user()->collaborator,
        ]);
    }

    // Update Profile
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:6|confirmed',
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:255',
            'date_birth' => 'sometimes|date|before:today',
            'speciality' => 'sometimes|string|max:255',
            'license_number' => 'sometimes|string|max:255', // Fixed: licenseNumber → license_number
            'workplace' => 'sometimes|string|max:255',
        ]);

        // Update profile fields
        $profileData = Arr::only($data, ['first_name', 'last_name', 'phone', 'address', 'date_birth']);
        if (!empty($profileData)) {
            $user->profile()->update($profileData);
        }

        // Update user table fields
        $userData = Arr::only($data, ['name', 'email', 'password']);
        if (!empty($userData)) {
            // Hash password if it exists
            if (isset($userData['password'])) {
                $userData['password'] = Hash::make($userData['password']);
            }
            $user->update($userData);
        }

        // Update collaborator fields if exists
        if ($user->collaborator) {
            $collabData = Arr::only($data, ['speciality', 'license_number', 'workplace']); // Fixed: licenseNumber → license_number
            if (!empty($collabData)) {
                $user->collaborator()->update($collabData);
            }
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->load(['profile', 'patient', 'collaborator']),
        ]);
    }
}