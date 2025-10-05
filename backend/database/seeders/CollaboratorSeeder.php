<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class CollaboratorSeeder extends Seeder
{
    public function run(): void
    {
        // Get existing user IDs
        $userIds = DB::table('users')->pluck('id')->toArray();

        $collaborators = [
            [
                'id' => Str::uuid(),
                'user_id' => $userIds[0], // John Smith
                'speciality' => 'Cardiology',
                'licenseNumber' => 'MD123456',
                'workplace' => 'Healthcare General Hospital - Cardiology Department',
                'isAvailable' => true,
                'availability' => 'Monday-Friday 8AM-6PM',
                'rating' => 4.8,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'user_id' => $userIds[1], // Sarah Johnson
                'speciality' => 'Emergency Nursing',
                'licenseNumber' => 'RN789012',
                'workplace' => 'Healthcare General Hospital - Emergency Department',
                'isAvailable' => true,
                'availability' => 'Rotating shifts 24/7',
                'rating' => 4.9,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'user_id' => $userIds[3], // Maria Garcia
                'speciality' => 'Pediatrics',
                'licenseNumber' => 'MD789123',
                'workplace' => 'Healthcare General Hospital - Pediatric Wing',
                'isAvailable' => true,
                'availability' => 'Monday-Saturday 9AM-5PM',
                'rating' => 4.7,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => Str::uuid(),
                'user_id' => $userIds[4], // David Wilson
                'speciality' => 'Orthopedic Surgery',
                'licenseNumber' => 'MD456789',
                'workplace' => 'Healthcare General Hospital - Surgical Department',
                'isAvailable' => false,
                'availability' => 'On medical leave',
                'rating' => 4.6,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('collaborators')->insert($collaborators);
    }
}
