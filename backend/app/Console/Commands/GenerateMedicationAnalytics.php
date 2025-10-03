<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\MedicationIntake;
use App\Models\MedicationAnalysis;

class GenerateMedicationAnalytics extends Command
{
    protected $signature = 'analytics:generate'; 
    protected $description = 'Génère les statistiques mensuelles de prise de médicaments';

    public function handle()
    {
        $start = Carbon::now()->startOfMonth();
        $end   = Carbon::now()->endOfMonth();

        $intakes = MedicationIntake::select('patient_id', 'medication_id')
            ->distinct()
            ->get();

      foreach ($intakes as $intake) {
    $total = MedicationIntake::where('medication_id', $intake->medication_id)
        ->whereBetween('scheduled_time', [$start, $end])
        ->count();

    $taken = MedicationIntake::where('medication_id', $intake->medication_id)
        ->whereBetween('scheduled_time', [$start, $end])
        ->where('status', 'taken')
        ->count();

    $adherence = $total > 0 ? ($taken / $total) * 100 : 0;

    MedicationAnalysis::updateOrCreate(
        [
            'patient_id' => $intake->patient_id,
            'medication_id' => $intake->medication_id,
            'period_start' => $start,
            'period_end' => $end,
        ],
        [
            'total_intakes' => $total,
            'taken_intakes' => $taken,
            'adherence_rate' => $adherence,
        ]
    );
}


        $this->info('Statistiques générées avec succès !');
    }
}
