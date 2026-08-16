<?php

namespace Database\Factories;

use App\Enums\RepairStatus;
use App\Models\RepairOrder;
use App\Models\StatusLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StatusLog>
 */
class StatusLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'repair_order_id' => RepairOrder::factory(),
            'from' => RepairStatus::Received->value,
            'to' => RepairStatus::Diagnosing->value,
            'changed_by' => 'factory',
        ];
    }
}
