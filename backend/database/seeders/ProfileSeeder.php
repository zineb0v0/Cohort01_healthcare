<?php

namespace Database\Seeders;

use App\Models\Profile;
use Illuminate\Database\Seeder;

class ProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crée 10 profils (avec utilisateurs associés si nécessaire)
        Profile::factory()->count(10)->create();
    }
}
