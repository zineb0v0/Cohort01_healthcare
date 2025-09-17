<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Medication;
use App\Models\Appointment;
use App\Models\LabReport;
use App\Models\MedicationAnalysis;
use Illuminate\Http\Request;

class PatientController extends Controller
{

    protected $fillable = ['patient_id'];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id', 'patient_id');
    }

    public function medications()
    {
        return $this->hasMany(Medication::class, 'patient_id', 'patient_id');
    }

    public function labReports()
    {
        return $this->hasMany(LabReport::class, 'patient_id', 'patient_id');
    }
    
    // Dashboard du patient
  public function dashboard(Request $request)
{
    $user = $request->user();
    $patient = Patient::where('user_id', $user->id)->first();

    if (!$patient) {
        return response()->json(['message' => 'Patient introuvable'], 404);
    }

    $medications = Medication::where('patient_id', $patient->id)->get();
    $appointments = Appointment::where('patient_id', $patient->id)->get();
    $reports = LabReport::where('patient_id', $patient->id)->get();

    // Récupère les analyses déjà générées
    $analyses = MedicationAnalysis::where('patient_id', $patient->id)->orderBy('period_start', 'asc')->get();

    return response()->json([
        'patient' => $patient,
        'medications' => $medications,
        'appointments' => $appointments,
        'reports' => $reports,
        'analyses' => $analyses,
    ]);
}

}
