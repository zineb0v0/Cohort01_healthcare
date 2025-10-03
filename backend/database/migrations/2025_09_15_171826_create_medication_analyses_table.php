<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('medication_analyses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('patient_id');
            $table->uuid('medication_id');
            $table->date('period_start'); // début de la période (ex: semaine)
            $table->date('period_end');   // fin de la période
            $table->integer('total_intakes')->default(0); // nombre total prévu
            $table->integer('taken_intakes')->default(0); // nombre réellement pris
            $table->float('adherence_rate')->default(0);  // % d’adhérence
            $table->timestamps();

            // Relation
            $table->foreign('medication_id')->references('id')->on('medications')->onDelete('cascade');
            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medication_analyses');
    }
};
