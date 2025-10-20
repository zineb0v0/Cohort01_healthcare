<?php
namespace Database\Seeders;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::firstOrCreate(['name' => 'Patient']);
        $user = User::first();

        if ($user && !$user->hasRole('Patient')) {
            $user->assignRole($role);
        }

        if ($user) {
            Patient::firstOrCreate(
                ['user_id' => $user->id],
                ['id' => Str::uuid()->toString()]
            );
        }
    }
}
