<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('patient_id');
            $table->uuid('collaborator_id');
            $table->uuid('medical_dossier_id')->nullable();
            $table->dateTime('datetime');
            $table->time('start_time')->nullable();
            $table->enum('status', [
                'pending', 
                'confirmed', 
                'rejected', 
                'cancelled', 
                'completed'
            ])->default('pending');
            $table->string('type')->nullable();
            $table->boolean('is_telehealth')->default(false);
            $table->string('telehealth_url')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Foreign keys
            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
            $table->foreign('collaborator_id')->references('id')->on('collaborators')->onDelete('cascade');
            $table->foreign('medical_dossier_id')->references('id')->on('medical_dossiers')->onDelete('cascade');

            // Indexes
            $table->index(['patient_id', 'status']);
            $table->index(['collaborator_id', 'status']);
            $table->index('datetime');
            $table->index('medical_dossier_id');
            $table->index('is_telehealth');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};