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
        $request->validate([
            'medication_name' => 'required|string',
            'dosage' => 'required|string',
            'unit' => 'required|string',
            'frequency' => 'required|integer', // nombre de fois par jour
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'prescribed_by' => 'nullable|string',
            'reminder_schedule' => 'nullable|array', // ✅ Doit être un tableau JSON
            'reminder_schedule.*' => 'regex:/^\d{2}:\d{2}$/', // chaque heure doit être au format HH:MM
            'instructions' => 'nullable|string',
            'possible_side_effects' => 'nullable|string',
            'take_with_food' => 'boolean',
            'as_needed_prn' => 'boolean',
        ]);

        $patient = Patient::where('user_id', $request->user()->id)->firstOrFail();

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
            'reminder_schedule' => $request->reminder_schedule ? json_encode($request->reminder_schedule) : json_encode(['08:00']), // ✅ JSON
            'instructions' => $request->instructions,
            'possible_side_effects' => $request->possible_side_effects,
            'take_with_food' => $request->take_with_food ?? false,
            'as_needed_prn' => $request->as_needed_prn ?? false,
        ]);

        // ✅ Générer automatiquement les prises dans medication_intakes
        $start = Carbon::parse($medication->start_date);
        $end = $medication->end_date ? Carbon::parse($medication->end_date) : $start;

        // Décode pour pouvoir boucler dessus
        $reminders = json_decode($medication->reminder_schedule, true) ?? ['08:00'];

        $current = $start;
        while ($current->lte($end)) {
            foreach ($reminders as $time) {
                MedicationIntake::create([
                    'id' => Str::uuid()->toString(),
                    'patient_id' => $medication->patient_id,
                    'medication_id' => $medication->id,
                    'scheduled_time' => [Carbon::parse($current->format('Y-m-d').' '.trim($time))->toDateTimeString()],
                    'status' => ['scheduled'],
                ]);
            }
            $current->addDay();
        }

        return response()->json([
            'message' => 'Médicament et prises générés avec succès',
            'medication' => $medication,
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
