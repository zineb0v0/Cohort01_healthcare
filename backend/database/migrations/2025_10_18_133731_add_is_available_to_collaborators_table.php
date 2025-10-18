<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('collaborators', function (Blueprint $table) {
            $table->boolean('isAvailable')->default(true)->after('workplace');
        });
}

    public function down()
{
    Schema::table('collaborators', function (Blueprint $table) {
        $table->dropColumn('isAvailable');
    });
    }
};
