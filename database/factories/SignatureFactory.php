<?php

namespace Database\Factories;

use App\Models\Signature;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Signature>
 */
class SignatureFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * No default signable: tests supply one via ->for($model, 'signable').
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'signed_by' => 'bench',
            'signed_at' => now(),
        ];
    }
}
