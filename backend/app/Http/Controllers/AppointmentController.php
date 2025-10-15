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
        'type' => 'required|in:presentiel,appel,appel_video', // type de rendez-vous
    ]);

    $appointment = \App\Models\Appointment::create([
        'id' => Str::uuid(),
        'patient_id' => $validated['patient_id'],
        'collaborator_id' => $validated['collaborator_id'],
        'date' => $validated['date'],
        'time' => $validated['time'],
        'status' => 'pending',
        'isTelehealth' => in_array($validated['type'], ['appel','appel_video']),
        'telehealthLink' => $validated['type'] == 'appel_video' ? 'https://zoom.link/'.Str::random(10) : null,
    ]);

    return response()->json([
        'message' => 'Appointment created successfully',
        'appointment' => $appointment
    ]);
}

}
