<?php

namespace App\Http\Controllers\API;

use Log;
use Exception;
use App\Models\Patient;
use App\Models\LabReport;
use App\Models\Medication;
use App\Models\Appointment;
use Illuminate\Http\Request;
use App\Models\MedicationAnalysis;
use App\Http\Controllers\Controller;

class PatientController extends Controller
{
    // Dashboard du patient
public function dashboard(Request $request)
{
    try {
        $user = $request->user(); // Get the authenticated user

        // Ensure user is authenticated
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Get the patient record associated with the authenticated user
        $patient = Patient::where('user_id', $user->id)->first();

        // If no patient record exists, return a 404 response
        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        // Fetch related data for the patient
        $medications = $patient->medications;
        $appointments = $patient->appointments;
        $reports = $patient->labReports;
        $analyses = $patient->analyses->sortBy('period_start');

        // Return the data as a JSON response
        return response()->json([
            'patient' => $patient,
            'medications' => $medications,
            'appointments' => $appointments,
            'reports' => $reports,
            'analyses' => $analyses,
        ]);

    } catch (Exception $e) {
        // Log the error for debugging
        Log::error('Error fetching patient dashboard: ' . $e->getMessage());

        // Return a generic error message
        return response()->json(['message' => 'An error occurred. Please try again later.'], 500);
    }
}

}
