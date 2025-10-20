<?php

namespace Database\Seeders;

use App\Models\Medication;
use App\Models\MedicationIntake;
use App\Models\Patient;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MedicationSeeder extends Seeder
{
    public function run(): void
    {
        $patient = Patient::first();

        if (!$patient) {
            $this->command->error("Aucun patient trouvé. Créez d'abord un patient.");
            return;
        }

        $medicationsData = [
            [
                'medication_name' => 'Paracetamol',
                'dosage' => '500',
                'unit' => 'mg',
                'frequency' => 3,
                'start_date' => now()->subDays(5)->format('Y-m-d'),
                'end_date' => now()->addDays(5)->format('Y-m-d'),
                'reminder_schedule' => ['08:00', '14:00', '20:00'],
                'prescribed_by' => 'Dr. Smith',
                'instructions' => 'Take after meals',
                'possible_side_effects' => 'Nausea, dizziness',
                'take_with_food' => true,
                'as_needed_prn' => false,
            ],
            [
                'medication_name' => 'Amoxicillin',
                'dosage' => '250',
                'unit' => 'mg',
                'frequency' => 2,
                'start_date' => now()->subDays(3)->format('Y-m-d'),
                'end_date' => now()->addDays(7)->format('Y-m-d'),
                'reminder_schedule' => ['09:00', '21:00'],
                'prescribed_by' => 'Dr. John',
                'instructions' => 'Drink plenty of water',
                'possible_side_effects' => 'Rash, diarrhea',
                'take_with_food' => false,
                'as_needed_prn' => false,
            ],
            [
                'medication_name' => 'Vitamin D',
                'dosage' => '1000',
                'unit' => 'IU',
                'frequency' => 1,
                'start_date' => now()->format('Y-m-d'),
                'end_date' => now()->addMonths(1)->format('Y-m-d'),
                'reminder_schedule' => ['10:00'],
                'prescribed_by' => 'Dr. Jane',
                'instructions' => 'Take with breakfast',
                'possible_side_effects' => 'Mild nausea',
                'take_with_food' => true,
                'as_needed_prn' => false,
            ],
        ];

        foreach ($medicationsData as $data) {
            $med = Medication::create(array_merge($data, [
                'id' => Str::uuid()->toString(),
                'patient_id' => $patient->id,
                'reminder_schedule' => json_encode($data['reminder_schedule']),
            ]));

            $start = Carbon::parse($med->start_date);
            $end = Carbon::parse($med->end_date);
            $times = $data['reminder_schedule'];

            for ($date = $start; $date->lte($end); $date->addDay()) {

                // Simulate occasional skipped day (10% chance)
                if (rand(1, 10) === 1) {
                    $takenTime = array_fill(0, count($times), null);
                } else {
                    $takenTime = array_map(function ($time) {
                        // Morning doses are more likely to be taken
                        $hour = (int)explode(':', $time)[0];
                        $chance = $hour < 12 ? 0.9 : 0.6; // 90% morning, 60% afternoon/evening
                        return rand(0, 100) / 100 <= $chance ? $time : null;
                    }, $times);
                }

                $status = array_map(fn($t) => $t ? 'taken' : 'missed', $takenTime);

                MedicationIntake::create([
                    'id' => Str::uuid()->toString(),
                    'patient_id' => $patient->id,
                    'medication_id' => $med->id,
                    'intake_date' => $date->format('Y-m-d'),
                    'scheduled_time' => json_encode($times),
                    'taken_time' => json_encode($takenTime),
                    'status' => json_encode($status),
                ]);
            }
        }

        $this->command->info("Realistic medication intakes created for patient: {$patient->id}");
    }
}
