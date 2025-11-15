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
            $table->date('intake_date')->nullable();

            $table->json('scheduled_time')->nullable();
            $table->json('taken_time')->nullable();
            $table->json('status')->nullable();
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
