<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Appointment>
 */
class AppointmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => $this->faker->uuid(),
            'patient_id' => \App\Models\Patient::factory(),
            'collaborator_id' => 'aff66a73-3ad3-4330-a0f0-591c0e1bf188',
            'date' => $this->faker->date(),
            'time' => $this->faker->time(),
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'canceled']),
            'isTelehealth' => $this->faker->boolean(),
            'telehealthLink' => $this->faker->optional()->url(),
        ];
    }
}
