<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ProfileSeeder extends Seeder
{
    public function run(): void
    {
        // Get user IDs to link profiles
        $userIds = DB::table('users')->pluck('id');

        $profiles = [
            [
                'id' => Str::uuid(),
                'user_id' => $userIds[0], // John Smith
                'first_name' => 'John',
                'last_name' => 'Smith',
                'phone' => '+1234567896',
                'address' => '123 Medical Center Dr, Healthcare City, HC 12345',
                'date_birth' => '1975-05-15',
                'gender' => 'male',
                'emergency_contact' => 'Jane Smith - +1234567800',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'user_id' => $userIds[1], // Sarah Johnson
                'first_name' => 'Sarah',
                'last_name' => 'Johnson',
                'phone' => '+1234567897',
                'address' => '456 Nurse Lane, Healthcare City, HC 12345',
                'date_birth' => '1985-08-22',
                'gender' => 'female',
                'emergency_contact' => 'Mike Johnson - +1234567801',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'user_id' => $userIds[2], // Admin User
                'first_name' => 'Admin',
                'last_name' => 'User',
                'phone' => '+1234567900',
                'address' => '789 Admin Blvd, Healthcare City, HC 12345',
                'date_birth' => '1980-12-10',
                'gender' => 'other',
                'emergency_contact' => 'System Administrator - +1234567999',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'user_id' => $userIds[3], // Maria Garcia
                'first_name' => 'Maria',
                'last_name' => 'Garcia',
                'phone' => '+1234567898',
                'address' => '321 Pediatric Ave, Healthcare City, HC 12345',
                'date_birth' => '1982-03-18',
                'gender' => 'female',
                'emergency_contact' => 'Carlos Garcia - +1234567802',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'user_id' => $userIds[4], // David Wilson
                'first_name' => 'David',
                'last_name' => 'Wilson',
                'phone' => '+1234567899',
                'address' => '654 Orthopedic St, Healthcare City, HC 12345',
                'date_birth' => '1978-11-05',
                'gender' => 'male',
                'emergency_contact' => 'Lisa Wilson - +1234567803',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('profiles')->insert($profiles);
    }
}
