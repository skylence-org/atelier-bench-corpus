<?php

namespace Database\Factories;

use App\Enums\Priority;
use App\Enums\RepairStatus;
use App\Models\Customer;
use App\Models\Device;
use App\Models\RepairOrder;
use App\Models\Technician;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RepairOrder>
 */
class RepairOrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * Sequence-based values keep reruns deterministic: no faker uniqueness.
     * The reference column is assigned by the HasReference trait on create.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $sequence = 0;
        $sequence++;

        return [
            'customer_id' => Customer::factory(),
            'device_id' => Device::factory(),
            'technician_id' => Technician::factory(),
            'status' => RepairStatus::Received,
            'priority' => Priority::Normal,
            'subtotal_cents' => 0,
            'opened_at' => now()->subMinutes($sequence),
            'completed_at' => null,
        ];
    }

    /**
     * Rush-priority order.
     */
    public function rush(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => Priority::Rush,
        ]);
    }

    /**
     * Order already completed, with the completion timestamp set.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => RepairStatus::Completed,
            'completed_at' => now(),
        ]);
    }
}
