<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('password'), // mot de passe par défaut
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (User $user) {
            // Crée automatiquement un profil pour cet utilisateur
            $user->profile()->create([
                'first_name' => $this->faker->firstName(),
                'last_name' => $this->faker->lastName(),
                'phone' => $this->faker->phoneNumber(),
                'address' => $this->faker->address(),
                'date_birth' => $this->faker->date(),
                'gender' => $this->faker->randomElement(['homme', 'femme']),
                'urgency_number' => $this->faker->phoneNumber(),
            ]);
        });
    }
}
