<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('medication_intakes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('patient_id');
            $table->uuid('medication_id');

            $table->dateTime('scheduled_time');   // Heure prévue de la prise
            $table->dateTime('taken_time')->nullable(); // Heure réelle de la prise
            $table->enum('status', ['scheduled', 'taken', 'missed', 'late'])->default('scheduled'); // Nouveau champ status

            $table->timestamps();

            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
            $table->foreign('medication_id')->references('id')->on('medications')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medication_intakes');
    }
};
