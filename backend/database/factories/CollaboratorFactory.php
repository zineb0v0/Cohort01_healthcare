<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Collaborator>
 */
class CollaboratorFactory extends Factory
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
            'user_id' => \App\Models\User::factory(),
            'speciality' => $this->faker->word(),
            'licenseNumber' => $this->faker->bothify('LIC-####'),
            'workplace' => $this->faker->company(),
            'isAvailable' => $this->faker->boolean(),
            'availability' => $this->faker->randomElement(['morning', 'afternoon', 'evening']),
            'rating' => $this->faker->randomFloat(1, 0, 5),
        ];
    }
}
