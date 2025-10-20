<?php

namespace Database\Seeders;

use App\Models\Medication;
use App\Models\MedicationIntake;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MedicationIntakesSeeder extends Seeder
{
    public function run(): void
    {
        $medications = Medication::whereIn('id', [
            '0490d9fa-393f-4015-b84c-1730190f473e', // Alpraz
            'cf4428d3-7bc5-49a8-97a2-2e979d5fb6a8', // Paracetamol
            'e984dae3-ef87-41df-94f1-260e041e9447', // Vitamin D
        ])->get();

        foreach ($medications as $med) {
            $scheduledTimes = json_decode($med->reminder_schedule, true);
            $startDate = Carbon::parse($med->start_date);
            $endDate = Carbon::parse($med->end_date);

            for ($date = $startDate; $date->lte($endDate); $date->addDay()) {
                $takenStatus = [];

                // Loop over each scheduled time for the day
                foreach ($scheduledTimes as $time) {
                    // Randomly decide if this dose is 'taken' or still 'scheduled'
                    $takenStatus[] = rand(0, 1) === 1 ? 'taken' : 'scheduled';
                }

                MedicationIntake::create([
                    'id' => Str::uuid()->toString(),
                    'patient_id' => $med->patient_id,
                    'medication_id' => $med->id,
                    'intake_date' => $date->format('Y-m-d'),
                    'scheduled_time' => json_encode($scheduledTimes),
                    'taken_time' => json_encode(array_fill(0, count($scheduledTimes), null)), // you can update this later
                    'status' => json_encode($takenStatus),
                ]);
            }
        }

        echo "All medication intakes generated!\n";
    }
}
