<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
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
            'name' => "Customer {$sequence}",
            'email' => "customer-{$sequence}@atelier.test",
            'phone' => sprintf('+32 470 %06d', $sequence),
        ];
    }
}
