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
        Schema::create('lab_reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('patient_id')->unique();
            $table->uuid('medical_dossier_id')->unique();

            $table->string('file_path');
            $table->date('uploaded_at')->useCurrent(); // ->useCurrent() tells the database: “If no value is provided for this column when inserting a row, automatically fill it with the current timestamp.”
            $table->text('extracted_data')->nullable();
            $table->json('abnormal_values')->nullable();
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
        Schema::dropIfExists('lab_reports');
    }
};
