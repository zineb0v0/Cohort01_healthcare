<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AppointmentController extends Controller
{

public function createAppointment(Request $request)
{
    $validated = $request->validate([
        'patient_id' => 'required|uuid|exists:patients,id',
        'collaborator_id' => 'required|uuid|exists:collaborators,id',
        'date' => 'required|date',
        'time' => 'required|date_format:H:i:s',
        'type' => 'required|in:presentiel,appel,appel_video',// type de rendez-vous
        'medical_dossier_id' => 'nullable|uuid|exists:medical_dossiers,id',
    ]);

    $datetime = $validated['date'] . ' ' . $validated['time'];

    $appointment = \App\Models\Appointment::create([
        'id' => Str::uuid(),
        'patient_id' => $validated['patient_id'],
        'collaborator_id' => $validated['collaborator_id'],
        'medical_dossier_id' => $validated['medical_dossier_id'] ?? null,
        'datetime' => $datetime,                    // Use actual column name
        'start_time' => $validated['time'],         // Use actual column name
        'status' => 'pending',
        'type' => $validated['type'],               // Use actual column name
        'is_telehealth' => in_array($validated['type'], ['appel','appel_video']),
        'telehealth_url' => $validated['type'] == 'appel_video' ? 'https://zoom.link/'.Str::random(10) : null, // Use actual column name
        ]);

    return response()->json([
        'message' => 'Appointment created successfully',
        'appointment' => $appointment
    ]);
}

}
