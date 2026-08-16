<?php

namespace Database\Factories;

use App\Models\Part;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Part>
 */
class PartFactory extends Factory
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
            'sku' => sprintf('PRT-%04d', $sequence),
            'name' => "Part {$sequence}",
            'unit_price_cents' => 500 + ($sequence % 10) * 100,
            'stock' => 10,
        ];
    }
}
