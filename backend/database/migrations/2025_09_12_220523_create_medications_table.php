<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
            Schema::create('medications', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('patient_id'); // colonne pour la FK
                $table->string('medication_name');
                $table->string('dosage');
                $table->string('unit');
                $table->string('frequency');
                $table->date('start_date');
                $table->date('end_date')->nullable();
                $table->string('reminder_schedule');

                // Optionnels
                $table->string('prescribed_by')->nullable();
                $table->text('instructions')->nullable();
                $table->text('possible_side_effects')->nullable();
                $table->boolean('take_with_food')->nullable();
                $table->boolean('as_needed_prn')->nullable();

                $table->timestamps();
                $table->softDeletes();
                $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
            
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medications');
    }
};
