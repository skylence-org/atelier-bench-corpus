<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Device;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Device>
 */
class DeviceFactory extends Factory
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
            'customer_id' => Customer::factory(),
            'kind' => ['phone', 'laptop', 'tablet'][$sequence % 3],
            'brand' => 'Fairphone',
            'model' => "Model {$sequence}",
            'serial' => sprintf('SN-%06d', $sequence),
        ];
    }
}
