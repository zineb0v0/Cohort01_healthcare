<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class MedicationSeeder extends Seeder
{
    public function run(): void
    {
        // Get existing patient IDs
        $patientIds = DB::table('patients')->pluck('id')->toArray();

        $medications = [
            [
                'id' => Str::uuid(),
                'patient_id' => $patientIds[0],
                'medication_name' => 'Lisinopril',
                'dosage' => '10',
                'unit' => 'mg',
                'frequency' => 'Once daily',
                'start_date' => Carbon::now()->subMonths(6)->format('Y-m-d'),
                'end_date' => null,
                'reminder_schedule' => '08:00:00',
                'prescribed_by' => 'Dr. John Smith',
                'instructions' => 'Take with or without food, same time each day',
                'possible_side_effects' => 'Dizziness, dry cough, hyperkalemia',
                'take_with_food' => false,
                'as_needed_prn' => false,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'patient_id' => $patientIds[0],
                'medication_name' => 'Metformin',
                'dosage' => '500',
                'unit' => 'mg',
                'frequency' => 'Twice daily',
                'start_date' => Carbon::now()->subMonths(3)->format('Y-m-d'),
                'end_date' => null,
                'reminder_schedule' => '08:00:00',
                'prescribed_by' => 'Dr. John Smith',
                'instructions' => 'Take with meals to reduce stomach upset',
                'possible_side_effects' => 'Nausea, diarrhea, stomach upset',
                'take_with_food' => true,
                'as_needed_prn' => false,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'patient_id' => $patientIds[1],
                'medication_name' => 'Albuterol Inhaler',
                'dosage' => '90',
                'unit' => 'mcg',
                'frequency' => 'As needed',
                'start_date' => Carbon::now()->subYear()->format('Y-m-d'),
                'end_date' => null,
                'reminder_schedule' => '00:00:00',
                'prescribed_by' => 'Dr. Maria Garcia',
                'instructions' => 'Use for asthma symptoms, max 4 times daily',
                'possible_side_effects' => 'Tremor, nervousness, headache',
                'take_with_food' => null,
                'as_needed_prn' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'patient_id' => $patientIds[2],
                'medication_name' => 'Ibuprofen',
                'dosage' => '400',
                'unit' => 'mg',
                'frequency' => 'Three times daily',
                'start_date' => Carbon::now()->subWeeks(2)->format('Y-m-d'),
                'end_date' => Carbon::now()->addWeeks(1)->format('Y-m-d'),
                'reminder_schedule' => '08:00:00',
                'prescribed_by' => 'Dr. John Smith',
                'instructions' => 'Take after meals for pain relief',
                'possible_side_effects' => 'Stomach upset, dizziness, drowsiness',
                'take_with_food' => true,
                'as_needed_prn' => false,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('medications')->insert($medications);
    }
}
