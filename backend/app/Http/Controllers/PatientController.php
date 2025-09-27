<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Medication;
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
            'reports' => [] // placeholder
        ]);
    }
}
