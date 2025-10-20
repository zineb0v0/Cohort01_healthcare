<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Collaborator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        // Pick random existing patient and collaborator
        $patient = Patient::inRandomOrder()->first();
        $collaborator = Collaborator::inRandomOrder()->first();

        return [
            'id' => Str::uuid()->toString(),
            'patient_id' => $patient ? $patient->id : Str::uuid(),
            'collaborator_id' => $collaborator ? $collaborator->id : Str::uuid(),
            'date' => $this->faker->dateTimeBetween('+1 days', '+1 month'),
            'time' => $this->faker->time('H:i:s'),
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'canceled']),
            'is_telehealth' => $this->faker->boolean(30), // 30% chance
            'telehealth_url' => $this->faker->boolean(30) ? $this->faker->url() : null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
