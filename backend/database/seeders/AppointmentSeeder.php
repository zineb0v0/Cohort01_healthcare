<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Collaborator;
use Illuminate\Support\Str;
use Carbon\Carbon;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer un patient existant
        $patient = Patient::first();
        // Récupérer un collaborateur existant
        $collaborator = Collaborator::first();

        if (!$patient || !$collaborator) {
            $this->command->error("Aucun patient ou collaborateur trouvé !");
            return;
        }

        // Créer quelques rendez-vous
        for ($i = 1; $i <= 5; $i++) {
            $date = Carbon::now()->addDays($i); // rendez-vous dans les prochains jours
            Appointment::firstOrCreate(
                [
                    'patient_id' => $patient->id,
                    'collaborator_id' => $collaborator->id,
                    'date' => $date,
                ],
                [
                    'id' => Str::uuid()->toString(),
                    'time' => $date->format('H:i:s'),
                    'status' => 'pending',
                    'is_telehealth' => ($i % 2 == 0), // alterne entre téléconsultation et physique
                    'telehealth_url' => ($i % 2 == 0) ? 'https://zoom.us/meeting'.$i : null,
                ]
            );
        }

        $this->command->info("5 appointments created for patient {$patient->id} and collaborator {$collaborator->id}");
    }
}
