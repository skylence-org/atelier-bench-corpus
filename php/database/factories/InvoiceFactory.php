<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\RepairOrder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
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
            'repair_order_id' => RepairOrder::factory(),
            'number' => sprintf('INV-%04d', $sequence),
            'issued_at' => now(),
            'total_cents' => 0,
        ];
    }
}
