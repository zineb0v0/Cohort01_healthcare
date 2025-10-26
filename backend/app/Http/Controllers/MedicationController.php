<?php

namespace App\Http\Controllers;

use App\Models\Medication;
use App\Models\MedicationIntake;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class MedicationController extends Controller
{
    // Liste des médicaments
    public function index(Request $request)
    {
        $user = $request->user();
        $patient = Patient::where('user_id', $user->id)->first();

        return Medication::where('patient_id', $patient->id)->get();
    }

    // Ajouter un médicament
public function store(Request $request)
{
    // ✅ Validation
    $request->validate([
        'medication_name' => 'required|string',
        'dosage' => 'required|string',
        'unit' => 'required|string',
        'frequency' => 'required|integer',
        'start_date' => 'required|date',
        'end_date' => 'nullable|date',
        'prescribed_by' => 'nullable|string',
        'reminder_schedule' => 'required|array|min:1',
        'reminder_schedule.*' => 'required|string|date_format:H:i',
        'instructions' => 'nullable|string',
        'possible_side_effects' => 'nullable|string',
        'take_with_food' => 'nullable|boolean',
        'as_needed_prn' => 'nullable|boolean',
    ]);

    $patient = Patient::where('user_id', $request->user()->id)->firstOrFail();

    // JSON pour DB
    $reminderScheduleJson = json_encode($request->reminder_schedule);

    // ✅ Create medication
    $medication = Medication::create([
        'id' => Str::uuid()->toString(),
        'patient_id' => $patient->id,
        'medication_name' => $request->medication_name,
        'dosage' => $request->dosage,
        'unit' => $request->unit,
        'frequency' => $request->frequency,
        'start_date' => $request->start_date,
        'end_date' => $request->end_date,
        'prescribed_by' => $request->prescribed_by,
        'reminder_schedule' => $reminderScheduleJson,
        'instructions' => $request->instructions,
        'possible_side_effects' => $request->possible_side_effects,
        'take_with_food' => $request->take_with_food ?? false,
        'as_needed_prn' => $request->as_needed_prn ?? false,
    ]);

    // Générer MedicationIntakes - ONE RECORD PER REMINDER PER DAY
    $start = Carbon::parse($medication->start_date);
    $end = $medication->end_date ? Carbon::parse($medication->end_date) : $start->copy()->addDays(30);
    $reminders = $request->reminder_schedule; // Array of times like ["08:00", "20:00"]
    $current = $start->copy();

    $intakesCreated = 0;
    while ($current->lte($end)) {
        // Create one intake record for EACH reminder time
        foreach ($reminders as $reminderTime) {
            // Combine date with time to create full datetime
            $scheduledDateTime = Carbon::parse($current->format('Y-m-d') . ' ' . $reminderTime);

            MedicationIntake::create([
                'id' => Str::uuid()->toString(),
                'patient_id' => $medication->patient_id,
                'medication_id' => $medication->id,
                'scheduled_time' => $scheduledDateTime, // DateTime: 2025-10-27 08:00:00
                'taken_time' => null, // Will be filled when user marks as taken
                'status' => 'scheduled',
            ]);

            $intakesCreated++;
        }

        $current->addDay();
    }

    return response()->json([
        'message' => 'Médicament et prises générés avec succès',
        'medication' => $medication,
        'intakes_created' => $intakesCreated,
    ], 201);
}

    // Mettre à jour un médicament
    public function update(Request $request, $id)
    {
        $medication = Medication::findOrFail($id);

        $medication->update($request->only([
            'medication_name', 'dosage', 'unit', 'frequency', 'start_date', 'end_date',
            'prescribed_by', 'reminder_schedule', 'instructions', 'possible_side_effects',
            'take_with_food', 'as_needed_prn',
        ]));

        return response()->json($medication);
    }

    // Supprimer un médicament
    public function destroy($id)
    {
        $medication = Medication::findOrFail($id);
        $medication->delete();

        return response()->json(['message' => 'Médicament supprimé']);
    }
}
