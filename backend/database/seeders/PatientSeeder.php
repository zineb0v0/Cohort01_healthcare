<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        // First create additional users for patients
        $patientUsers = [
            [
                'id' => Str::uuid(),
                'email' => 'alice.williams@email.com',
                'password' => bcrypt('password'),
                'email_verified_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'email' => 'robert.brown@email.com',
                'password' => bcrypt('password'),
                'email_verified_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'email' => 'emma.davis@email.com',
                'password' => bcrypt('password'),
                'email_verified_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('users')->insert($patientUsers);

        // Get the newly created user IDs
        $userIds = collect($patientUsers)->pluck('id');

        $patients = [
            [
                'id' => Str::uuid(),
                'user_id' => $userIds[0],
                'urgencyNumber' => 'URG001',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'user_id' => $userIds[1],
                'urgencyNumber' => 'URG002',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'user_id' => $userIds[2],
                'urgencyNumber' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('patients')->insert($patients);

        // Create profiles for the patient users
        $patientProfiles = [
            [
                'id' => Str::uuid(),
                'user_id' => $userIds[0],
                'first_name' => 'Alice',
                'last_name' => 'Williams',
                'phone' => '+1234567890',
                'address' => '123 Main St, City, State 12345',
                'date_birth' => '1985-03-15',
                'gender' => 'female',
                'emergency_contact' => 'Bob Williams - +1234567891',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'user_id' => $userIds[1],
                'first_name' => 'Robert',
                'last_name' => 'Brown',
                'phone' => '+1234567892',
                'address' => '456 Oak Ave, City, State 12345',
                'date_birth' => '1978-07-22',
                'gender' => 'male',
                'emergency_contact' => 'Mary Brown - +1234567893',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'user_id' => $userIds[2],
                'first_name' => 'Emma',
                'last_name' => 'Davis',
                'phone' => '+1234567894',
                'address' => '789 Pine St, City, State 12345',
                'date_birth' => '1992-11-08',
                'gender' => 'female',
                'emergency_contact' => 'James Davis - +1234567895',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('profiles')->insert($patientProfiles);
    }
}
