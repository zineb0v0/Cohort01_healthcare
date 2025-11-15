<?php

namespace App\Http\Controllers;

use App\Models\MedicationIntake;
use App\Models\Patient;
use Carbon\Carbon;
use Illuminate\Http\Request;

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

    $patient = Patient::where('user_id', $user->id)->first();
    if (!$patient) {
        return response()->json(['message' => 'Patient introuvable'], 404);
    }

    $intakes = MedicationIntake::where('patient_id', $patient->id)->get();

    $daily = [];
    $weeklyAgg = [];
    $monthlyAgg = [];

    foreach ($intakes as $intake) {
        $takenTime = $intake->taken_time ? (is_string($intake->taken_time) ? json_decode($intake->taken_time, true) : $intake->taken_time) : [];
        $scheduledTime = $intake->scheduled_time ? (is_string($intake->scheduled_time) ? json_decode($intake->scheduled_time, true) : $intake->scheduled_time) : [];

        $medName = $intake->medication->medication_name ?? 'Unknown';

        foreach ($scheduledTime as $index => $scheduled) {
            $dateObj = Carbon::parse($scheduled);

            $taken = isset($takenTime[$index]) && $takenTime[$index] !== null ? 1 : 0;
            $percentage = 100 * $taken; // Each scheduled time counts as 100% if taken, 0% if not

            // Daily
            $daily[] = [
                'date' => $dateObj->format('Y-m-d'),
                'medication_name' => $medName,
                'percentage' => $percentage,
            ];

            // Weekly aggregation
            $startOfWeek = $dateObj->copy()->startOfWeek();
            $endOfWeek = $dateObj->copy()->endOfWeek();
            $weekLabel = $startOfWeek->format('j M').' - '.$endOfWeek->format('j M');
            $weeklyKey = $startOfWeek->format('Y-m-d').'-'.$medName;

            if (!isset($weeklyAgg[$weeklyKey])) {
                $weeklyAgg[$weeklyKey] = [
                    'week' => $weekLabel,
                    'week_start' => $startOfWeek->format('Y-m-d'),
                    'medication_name' => $medName,
                    'percentages' => [],
                ];
            }
            $weeklyAgg[$weeklyKey]['percentages'][] = $percentage;

            // Monthly aggregation
            $month = $dateObj->format('Y-m');
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
    }

    // Aggregate weekly
    $weekly = array_map(fn($item) => [
        'week' => $item['week'],
        'medication_name' => $item['medication_name'],
        'percentage' => round(array_sum($item['percentages']) / count($item['percentages']), 0),
        'week_start' => $item['week_start'],
    ], $weeklyAgg);

    usort($weekly, fn($a, $b) => strtotime($a['week_start']) <=> strtotime($b['week_start']));

    $weekly = array_map(fn($item) => [
        'week' => $item['week'],
        'medication_name' => $item['medication_name'],
        'percentage' => $item['percentage'],
    ], $weekly);

    // Aggregate monthly
    $monthly = array_map(fn($item) => [
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
