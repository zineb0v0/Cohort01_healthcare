<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('medication_analytics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('patient_id');
            $table->integer('missed_doses')->default(0);
            $table->decimal('adherence_rate', 5, 2)->unsigned()->nullable(); // only positive nums 0.00 to  100.00
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
        });
        DB::statement('ALTER TABLE medication_analytics ADD CONSTRAINT check_adherence_rate CHECK (adherence_rate <= 100)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medication_analytics');
    }
};
