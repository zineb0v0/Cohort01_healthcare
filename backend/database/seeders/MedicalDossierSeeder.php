<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Patient;
use App\Models\MedicalDossier;
use Illuminate\Support\Str;

class MedicalDossierSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer le patient (ici le premier pour le test)
        $patient = Patient::first();

        if ($patient) {
            MedicalDossier::firstOrCreate(
                ['patient_id' => $patient->id],
                [
                    'id' => Str::uuid()->toString(),
                ]
            );

            $this->command->info("Medical dossier created for patient_id={$patient->id}");
        } else {
            $this->command->warn("No patient found to create medical dossier!");
        }
    }
}
