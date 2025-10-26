<?php

namespace App\Http\Controllers;

use App\Models\MedicationIntake;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class MedicationIntakeController extends Controller
{
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

    public function todayIntakes(Request $request)
    {
        $user = $request->user();
        $patientId = $user->patient->id; // grâce à la relation hasOne dans User
        $today = \Carbon\Carbon::today();

        $intakes = MedicationIntake::where('patient_id', $patientId)
        ->whereDate('scheduled_time', $today)
        ->with('medication:id,medication_name,dosage,unit')
        ->orderBy('scheduled_time', 'asc')
        ->get();

        return response()->json([
            'message' => 'Intakes du jour pour le patient connecté',
            'patient_id' => $patientId,
            'count' => $intakes->count(),
            'intakes' => $intakes->map(function ($intake) {
                return [
                    'intake_id' => $intake->id,
                    'scheduled_time' => $intake->scheduled_time,
                    'status' => $intake->status,
                    'medication_name' => $intake->medication->medication_name ?? 'Médicament inconnu',
                    'dosage' => $intake->medication->dosage ?? '',
                    'unit' => $intake->medication->unit ?? '',
                ];
            }),
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

        // Récupérer les prises de médicaments du patient
        $intakes = MedicationIntake::with('medication')
            ->where('patient_id', $patient->id)
            ->orderBy('scheduled_time')
            ->get();

        $daily = [];
        $weeklyAgg = [];
        $monthlyAgg = [];

        // Group intakes by date and medication
        $groupedByDateAndMed = $intakes->groupBy(function ($intake) {
            return $intake->scheduled_time->format('Y-m-d').'|'.$intake->medication_id;
        });

        foreach ($groupedByDateAndMed as $key => $dayIntakes) {
            list($date, $medicationId) = explode('|', $key);

            $total = $dayIntakes->count();
            $taken = $dayIntakes->where('status', 'taken')->count();
            $percentage = $total > 0 ? round(($taken / $total) * 100, 0) : 0;

            $medName = $dayIntakes->first()->medication->medication_name ?? 'Unknown';
            $dateObj = Carbon::parse($date);

            // -----------------------------
            // Daily chart: simple YYYY-MM-DD
            // -----------------------------
            $daily[] = [
                'date' => $dateObj->format('Y-m-d'),
                'medication_name' => $medName,
                'percentage' => $percentage,
                'taken' => $taken,
                'total' => $total,
            ];

            // -----------------------------
            // Weekly aggregation with date range
            // -----------------------------
            $startOfWeek = $dateObj->copy()->startOfWeek(); // Monday
            $endOfWeek = $dateObj->copy()->endOfWeek();     // Sunday

            // Format week label like: "13 oct. - 19 oct."
            $weekLabel = $startOfWeek->format('j M').' - '.$endOfWeek->format('j M');

            // Use start date as internal key for sorting
            $weeklyKey = $startOfWeek->format('Y-m-d').'-'.$medName;
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
            'percentage' => count($item['percentages']) > 0
                ? round(array_sum($item['percentages']) / count($item['percentages']), 0)
                : 0,
            'week_start' => $item['week_start'], // keep start date for sorting
        ], $weeklyAgg);

        // Sort by week_start
        usort($weekly, fn ($a, $b) => strtotime($a['week_start']) <=> strtotime($b['week_start']));

        // Remove week_start from output
        $weekly = array_map(fn ($item) => [
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
            'percentage' => count($item['percentages']) > 0
                ? round(array_sum($item['percentages']) / count($item['percentages']), 0)
                : 0,
        ], $monthlyAgg);

        return response()->json([
            'daily' => array_values($daily),
            'weekly' => array_values($weekly),
            'monthly' => array_values($monthly),
        ]);
    }
}
