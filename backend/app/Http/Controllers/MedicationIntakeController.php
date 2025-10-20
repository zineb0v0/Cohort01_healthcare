<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Patient;
use Illuminate\Http\Request;
use App\Models\MedicationIntake;

class MedicationIntakeController extends Controller
{
    // -----------------------------
    // 1️⃣ Update intake status
    // -----------------------------
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:scheduled,taken,missed,late',
        ]);

        $intake = MedicationIntake::findOrFail($id);
        $intake->status = $request->status;

        if ($request->status === 'taken') {
            $intake->taken_time = now();
        }

        $intake->save();

        return response()->json([
            'message' => 'Statut mis à jour avec succès',
            'medication_intake' => $intake,
        ]);
    }

public function percentages(Request $request)
{
   $user = $request->user();

        // Récupérer le patient lié à cet utilisateur
        $patient = Patient::where('user_id', $user->id)->first();

        if (!$patient) {
            return response()->json(['message' => 'Patient introuvable'], 404);
        }

        // Récupérer les médicaments du patient
        $intakes = MedicationIntake::where('patient_id', $patient->id)->get();

    $daily = [];
    $weeklyAgg = [];
    $monthlyAgg = [];

    foreach ($intakes as $intake) {
        // Decode JSON arrays safely
        $takenTime = $intake->taken_time ? (is_string($intake->taken_time) ? json_decode($intake->taken_time, true) : $intake->taken_time) : [];
        $scheduledTime = $intake->scheduled_time ? (is_string($intake->scheduled_time) ? json_decode($intake->scheduled_time, true) : $intake->scheduled_time) : [];

        $total = count($scheduledTime);
        $taken = count(array_filter($takenTime, fn ($t) => $t !== null));
        $percentage = $total > 0 ? round(($taken / $total) * 100, 0) : 0;

        $medName = $intake->medication->medication_name ?? 'Unknown';
        $dateObj = Carbon::parse($intake->intake_date);

        // -----------------------------
        // Daily chart: simple YYYY-MM-DD
        // -----------------------------
        $daily[] = [
            'date' => $dateObj->format('Y-m-d'),
            'medication_name' => $medName,
            'percentage' => $percentage,
        ];

        // -----------------------------
        // Weekly aggregation with date range
        // -----------------------------
        $startOfWeek = $dateObj->copy()->startOfWeek(); // Monday
        $endOfWeek = $dateObj->copy()->endOfWeek();     // Sunday

        // Format week label like: "13 oct. - 19 oct."
        $weekLabel = $startOfWeek->format('j M') . ' - ' . $endOfWeek->format('j M');

        // Use start date as internal key for sorting
        $weeklyKey = $startOfWeek->format('Y-m-d') . '-' . $medName;
        if (!isset($weeklyAgg[$weeklyKey])) {
            $weeklyAgg[$weeklyKey] = [
                'week' => $weekLabel,
                'week_start' => $startOfWeek->format('Y-m-d'), // for sorting
                'medication_name' => $medName,
                'percentages' => [],
            ];
        }
        $weeklyAgg[$weeklyKey]['percentages'][] = $percentage;

        // -----------------------------
        // Monthly aggregation
        // -----------------------------
        $month = $dateObj->format('Y-m');  // e.g., 2025-10
        $monthlyKey = $month.'-'.$medName;
        if (!isset($monthlyAgg[$monthlyKey])) {
            $monthlyAgg[$monthlyKey] = [
                'month' => $month,
                'medication_name' => $medName,
                'percentages' => [],
            ];
        }
        $monthlyAgg[$monthlyKey]['percentages'][] = $percentage;
    }

    // -----------------------------
    // Aggregate weekly percentages
    // -----------------------------
    $weekly = array_map(fn ($item) => [
        'week' => $item['week'],
        'medication_name' => $item['medication_name'],
        'percentage' => round(array_sum($item['percentages']) / count($item['percentages']), 0),
        'week_start' => $item['week_start'], // keep start date for sorting
    ], $weeklyAgg);

    // Sort by week_start
    usort($weekly, fn($a, $b) => strtotime($a['week_start']) <=> strtotime($b['week_start']));

    // Remove week_start from output
    $weekly = array_map(fn($item) => [
        'week' => $item['week'],
        'medication_name' => $item['medication_name'],
        'percentage' => $item['percentage'],
    ], $weekly);

    // -----------------------------
    // Aggregate monthly percentages
    // -----------------------------
    $monthly = array_map(fn ($item) => [
        'month' => $item['month'],
        'medication_name' => $item['medication_name'],
        'percentage' => round(array_sum($item['percentages']) / count($item['percentages']), 0),
    ], $monthlyAgg);

    return response()->json([
        'daily' => $daily,
        'weekly' => $weekly,
        'monthly' => $monthly,
    ]);
}




}
