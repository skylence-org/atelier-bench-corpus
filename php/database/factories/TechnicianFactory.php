<?php

namespace Database\Factories;

use App\Models\Technician;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Technician>
 */
class TechnicianFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * Sequence-based values keep reruns deterministic: no faker uniqueness.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $sequence = 0;
        $sequence++;

        return [
            'name' => "Technician {$sequence}",
            'email' => "technician-{$sequence}@atelier.test",
            'specialty' => ['screens', 'batteries', 'boards'][$sequence % 3],
            'hourly_rate_cents' => 6000 + ($sequence % 5) * 500,
        ];
    }
}
