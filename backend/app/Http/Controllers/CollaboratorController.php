<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;

class CollaboratorController extends Controller
{
    // Get appointments for the authenticated collaborator
    public function getCollaboratorAppointments()
    {
        $user = Auth::user();
        $collaborator = $user->collaborator;

        if (!$collaborator) {
            return response()->json(['error' => 'Collaborator not found for this user.'], 404);
        }

$appointments = $collaborator->appointments()
    ->with([
        'patient.user.profile' => function ($query) {
            $query->select('id', 'user_id', 'first_name', 'last_name');
        },
        'collaborator.user.profile' => function ($query) {
            $query->select('id', 'user_id', 'first_name', 'last_name');
        }
    ])
    ->get();
        return response()->json($appointments);
    }

    // Get patients for the authenticated collaborator
    public function getCollaboratorPatients()
    {
        $user = Auth::user();
        $collaborator = $user->collaborator;

        if (!$collaborator) {
            return response()->json(['error' => 'Collaborator not found for this user.'], 404);
        }

$patients = $collaborator->patients()->with('user.profile')->get()->unique('id')->values();
        return response()->json($patients);
    }

    // Confirm an appointment
    public function confirmAppointment($appointmentId)
    {
        $user = Auth::user();
        $collaborator = $user->collaborator;

        if (!$collaborator) {
            return response()->json(['error' => 'Collaborator not found for this user.'], 404);
        }

        $appointment = $collaborator->appointments()->where('id', $appointmentId)->first();

        if (!$appointment) {
            return response()->json(['error' => 'Appointment not found or does not belong to this collaborator.'], 404);
        }

        $appointment->status = 'confirmed';
        $appointment->save();

        return response()->json(['message' => 'Appointment confirmed successfully.', 'appointment' => $appointment]);
    }

    // Cancel an appointment
    public function cancelAppointment($appointmentId)
    {
        $user = Auth::user();
        $collaborator = $user->collaborator;

        if (!$collaborator) {
            return response()->json(['error' => 'Collaborator not found for this user.'], 404);
        }

        $appointment = $collaborator->appointments()->where('id', $appointmentId)->first();

        if (!$appointment) {
            return response()->json(['error' => 'Appointment not found or does not belong to this collaborator.'], 404);
        }

        $appointment->status = 'canceled';
        $appointment->save();

        return response()->json(['message' => 'Appointment canceled successfully.', 'appointment' => $appointment]);
    }

    // Update appointment details (date and time)
    public function updateAppointment(Request $request, $appointmentId)
    {
        $user = Auth::user();
        $collaborator = $user->collaborator;

        if (!$collaborator) {
            return response()->json(['error' => 'Collaborator not found for this user.'], 404);
        }

        $appointment = $collaborator->appointments()->where('id', $appointmentId)->first();

        if (!$appointment) {
            return response()->json(['error' => 'Appointment not found or does not belong to this collaborator.'], 404);
        }

        $request->validate([
            'date' => 'required|date',
            'time' => 'required|date_format:H:i:s',
        ]);

        $appointment->date = $request->input('date');
        $appointment->time = $request->input('time');
        $appointment->save();

        return response()->json(['message' => 'Appointment updated successfully.', 'appointment' => $appointment]);
    }

    // Get collaborator profile
    public function getCollaboratorProfile()
    {
        $user = Auth::user();
        $collaborator = $user->collaborator;

        if (!$collaborator) {
            return response()->json(['error' => 'Collaborator not found for this user.'], 404);
        }

        $profile = $collaborator->user->profile;

        return response()->json(['collaborator' => $collaborator, 'profile' => $profile]);
    }

    // Update collaborator profile
    public function updateCollaboratorProfile(Request $request)
    {
        $user = \App\Models\User::find(Auth::id());
        $collaborator = $user->collaborator;
        $profile = $user->profile;

        if (!$collaborator || !$profile) {
            return response()->json(['error' => 'Collaborator or profile not found for this user.'], 404);
        }

        $validated = $request->validate([
            'email' => 'required|email|unique:users,email,' . $user->id,
            // Profile fields
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'date_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'emergency_contact' => 'nullable|string|max:255',
            // Collaborator fields
            'speciality' => 'nullable|string|max:255',
            'licenseNumber' => 'nullable|string|max:255',
            'workplace' => 'nullable|string|max:255',
            'availability' => 'nullable|string|max:255',
        ]);

        // Update user email
        $user->email = $validated['email'];
        $user->save();

        // Update profile
        $profile->update([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'date_birth' => $validated['date_birth'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'emergency_contact' => $validated['emergency_contact'] ?? null,
        ]);

        // Update collaborator info
        $collaborator->update([
            'speciality' => $validated['speciality'] ?? null,
            'licenseNumber' => $validated['licenseNumber'] ?? null,
            'workplace' => $validated['workplace'] ?? null,
            'availability' => $validated['availability'] ?? null,
        ]);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user,
            'profile' => $profile,
            'collaborator' => $collaborator,
        ]);
    }
}
