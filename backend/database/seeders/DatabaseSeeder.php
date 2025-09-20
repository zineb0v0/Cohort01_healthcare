<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // // Create 10 users with profiles
        // \App\Models\User::factory(10)
        //     ->has(\App\Models\Profile::factory())
        //     ->create();

        // // Create 5 collaborators (each with a user)
        // \App\Models\Collaborator::factory(5)->create();

        // // Create 5 patients (each with a user)
        // \App\Models\Patient::factory(5)->create();

        // Create 10 appointments (each with related patient and collaborator)
        \App\Models\Appointment::factory(5)->create();
    }
}
