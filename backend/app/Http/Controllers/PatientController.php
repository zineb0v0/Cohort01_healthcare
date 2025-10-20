<?php

namespace App\Http\Controllers;

use App\Models\Medication;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    // Dashboard du patient
    public function dashboard(Request $request)
    {
        $user = $request->user();

        // Récupérer le patient lié à cet utilisateur
        $patient = Patient::where('user_id', $user->id)->first();

        if (!$patient) {
            return response()->json(['message' => 'Patient introuvable'], 404);
        }

        // Récupérer les médicaments du patient
        $medications = Medication::where('patient_id', $patient->id)->get();

        return response()->json([
            'patient' => $patient,
            'medications' => $medications,
            'appointments' => [], // placeholder
            'reports' => [], // placeholder
        ]);
    }

    public function listAppointments(Request $request)
    {
        $patient = $request->user()->patient;

        if (!$patient) {
            return response()->json([], 404);
        }

        // Mapping raw type values to user-friendly labels
        $typeLabels = [
            'presentiel' => 'Présentiel',
            'appel' => 'Appel',
            'appel_video' => 'Appel vidéo',
        ];

        $appointments = $patient->appointments()
            ->with('collaborator.user.profile') // load collaborator → user → profile
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($a) use ($typeLabels) {
                $profile = $a->collaborator?->user?->profile;

                return [
                    'id' => $a->id,
                    'date' => $a->date->toDateString(),
                    'time' => $a->date->format('H:i'),
                    'type' => $typeLabels[$a->type],
                    'doctor' => $profile ? "{$profile->first_name} {$profile->last_name}" : 'Médecin',
                    'status' => $this->mapStatus($a->status),
                    'is_telehealth' => $a->is_telehealth,
                    'telehealth_url' => $a->telehealth_url,
                ];
            });

        return response()->json($appointments);
    }

    private function mapStatus($status)
    {
        return match ($status) {
            'pending' => 'En attente',
            'confirmed' => 'Confirmé',
            'canceled' => 'Annulé',
            'completed' => 'Terminé',
            default => $status,
        };
    }
}
