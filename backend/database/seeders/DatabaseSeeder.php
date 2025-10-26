<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Patient;
use App\Models\Profile;
use Illuminate\Support\Str;
use App\Models\Collaborator;
use App\Models\MedicalDossier;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Database\Seeders\MedicationSeeder;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // --- Roles & Permissions ---
        $patientRole = Role::firstOrCreate(['name' => 'Patient']);
        $collabRole = Role::firstOrCreate(['name' => 'Collaborateur']);

        Permission::firstOrCreate(['name' => 'view appointments']);
        Permission::firstOrCreate(['name' => 'create appointments']);
        Permission::firstOrCreate(['name' => 'update appointments']);
        Permission::firstOrCreate(['name' => 'delete appointments']);

        // --- Create patient user ---
        $patientUser = User::firstOrCreate(
            ['email' => 'patient@example.com'],
            ['password' => Hash::make('patient123')]
        );
        $patientUser->assignRole($patientRole);

        // Profile for patient
        Profile::firstOrCreate(
            ['user_id' => $patientUser->id],
            [
                'id' => Str::uuid()->toString(),
                'first_name' => 'John',
                'last_name' => 'Doe',
                'phone' => '0612345678',
                'address' => '123 Main Street, Casablanca',
                'date_birth' => '1990-05-20',
                'gender' => 'male',
                'emergency_contact' => '0654321987',
            ]
        );

        // Patient table entry
        $patient = Patient::firstOrCreate(
            ['user_id' => $patientUser->id],
            ['id' => Str::uuid()->toString()]
        );

        // --- Medical dossier for patient ---
        MedicalDossier::firstOrCreate(
            ['patient_id' => $patient->id],
            ['id' => Str::uuid()->toString()]
        );

        $this->command->info('Patient created: email=patient@example.com, password=patient123');
        $this->command->info('Medical dossier created for patient');

        // --- Create collaborator user ---
        $collabUser = User::firstOrCreate(
            ['email' => 'collaborator@example.com'],
            ['password' => Hash::make('collab123')]
        );
        $collabUser->assignRole($collabRole);

        // Profile for collaborator
        Profile::firstOrCreate(
            ['user_id' => $collabUser->id],
            [
                'id' => Str::uuid()->toString(),
                'first_name' => 'Alice',
                'last_name' => 'Smith',
                'phone' => '0623456789',
                'address' => '456 Main Street, Casablanca',
                'date_birth' => '1985-08-15',
                'gender' => 'female',
                'emergency_contact' => '0659876543',
            ]
        );

        // Collaborator table entry
        Collaborator::firstOrCreate(
            ['user_id' => $collabUser->id],
            [
                'id' => Str::uuid()->toString(),
                'speciality' => 'Cardiology',
                'license_number' => 'CARD-2025-001',
                'workplace' => 'Casablanca Clinic',
                'isAvailable' => true,
                'availability' => 'Mon-Fri 9:00-17:00',
                'rating' => 4.75,
            ]
        );

        $this->command->info('Collaborator created: email=collaborator@example.com, password=collab123');
        // --- Create appointments ---
        $this->call(AppointmentSeeder::class);
        // --- Create medications & medication intakes for the first patient ---
        $this->call(MedicationSeeder::class);
    }
}
