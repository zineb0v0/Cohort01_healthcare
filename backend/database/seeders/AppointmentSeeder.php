<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        // Get existing patient and collaborator IDs
        $patientIds = DB::table('patients')->pluck('id')->toArray();
        $collaboratorIds = DB::table('collaborators')->pluck('id')->toArray();

        $appointments = [
            [
                'id' => Str::uuid(),
                'patient_id' => $patientIds[0],
                'collaborator_id' => $collaboratorIds[0], // John Smith - Cardiologist
                'date' => Carbon::now()->addDays(7),
                'time' => '10:00:00',
                'status' => 'confirmed',
                'isTelehealth' => false,
                'telehealthLink' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'patient_id' => $patientIds[1],
                'collaborator_id' => $collaboratorIds[2], // Maria Garcia - Pediatrician
                'date' => Carbon::now()->addDays(3),
                'time' => '14:30:00',
                'status' => 'confirmed',
                'isTelehealth' => true,
                'telehealthLink' => 'https://meet.hospital.com/room/apt-' . Str::random(8),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'patient_id' => $patientIds[2],
                'collaborator_id' => $collaboratorIds[0], // John Smith - Cardiologist
                'date' => Carbon::yesterday(),
                'time' => '09:15:00',
                'status' => 'pending',
                'isTelehealth' => false,
                'telehealthLink' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'patient_id' => $patientIds[0],
                'collaborator_id' => $collaboratorIds[1], // Sarah Johnson - Emergency Nurse
                'date' => Carbon::now()->addDays(14),
                'time' => '16:00:00',
                'status' => 'confirmed',
                'isTelehealth' => true,
                'telehealthLink' => 'https://meet.hospital.com/room/apt-' . Str::random(8),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('appointments')->insert($appointments);
    }
}
