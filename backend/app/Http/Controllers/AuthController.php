<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
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
            'user' => $user->load(['profile', 'patient']),
        ]);
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
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->load(['profile', 'patient']),
        ]);
    }
}
