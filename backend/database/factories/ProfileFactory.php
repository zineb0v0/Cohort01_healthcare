<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Profile>
 */
class ProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = \App\Models\Profile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(), // Crée automatiquement un user si non fourni
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'date_birth' => $this->faker->date(),
            'gender' => $this->faker->randomElement(['homme', 'femme']),
            'emergency_contact' => $this->faker->phoneNumber(),
        ];
    }
}
