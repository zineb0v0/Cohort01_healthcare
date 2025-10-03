<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        Role::firstOrCreate(['name' => 'Patient']);
        Role::firstOrCreate(['name' => 'Collaborateur']);

        Permission::firstOrCreate(['name' => 'view appointments']);
        Permission::firstOrCreate(['name' => 'create appointments']);
        Permission::firstOrCreate(['name' => 'update appointments']);
        Permission::firstOrCreate(['name' => 'delete appointments']);
    }
}
