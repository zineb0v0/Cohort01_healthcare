<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\MedicationIntake;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class MedicationIntakeController extends Controller
{
    public function updateStatus(Request $request, $id)
    {
    $request->validate([
        'status' => 'required|in:scheduled,taken,missed,late'
    ]);

    $intake = MedicationIntake::findOrFail($id);
    $intake->status = $request->status;

    if ($request->status === 'taken') {
        $intake->taken_time = now();
    }

    $intake->save();

    return response()->json([
        'message' => 'Statut mis à jour avec succès',
        'medication_intake' => $intake
    ]);
}
public function todayIntakes(Request $request)
{
    $user = $request->user();
    $patientId = $user->patient->id; // grâce à la relation hasOne dans User
    $today = \Carbon\Carbon::today();

    $intakes = \App\Models\MedicationIntake::where('patient_id', $patientId)
    ->whereDate('scheduled_time', $today)
    ->with('medication:id,medication_name,dosage,unit')
    ->orderBy('scheduled_time', 'asc')
    ->get();


return response()->json([
    'message' => 'Intakes du jour pour le patient connecté',
    'patient_id' => $patientId,
    'count' => $intakes->count(),
  'intakes' => $intakes->map(function($intake) {
    return [
        'intake_id' => $intake->id,
        'scheduled_time' => $intake->scheduled_time,
        'status' => $intake->status,
        'medication_name' => $intake->medication->medication_name ?? 'Médicament inconnu',
        'dosage' => $intake->medication->dosage ?? '',
        'unit' => $intake->medication->unit ?? '',
    ];
})

]);

}
public function percentages(Request $request)
{
    $user = $request->user();
    $patientId = $user->patient->id;
    $today = Carbon::today();

    // Get all intakes for today
    $intakes = MedicationIntake::where('patient_id', $patientId)
        ->whereDate('scheduled_time', $today)
        ->get();

    $total = $intakes->count();
    $taken = $intakes->where('status', 'taken')->count();
    $missed = $intakes->where('status', 'missed')->count();
    $late = $intakes->where('status', 'late')->count();
    $scheduled = $intakes->where('status', 'scheduled')->count();

    return response()->json([
        'total' => $total,
        'percentages' => [
            'taken' => $total > 0 ? ($taken / $total) * 100 : 0,
            'missed' => $total > 0 ? ($missed / $total) * 100 : 0,
            'late' => $total > 0 ? ($late / $total) * 100 : 0,
            'scheduled' => $total > 0 ? ($scheduled / $total) * 100 : 0
        ],
        'counts' => [
            'taken' => $taken,
            'missed' => $missed,
            'late' => $late,
            'scheduled' => $scheduled
        ]
    ]);
}
}
