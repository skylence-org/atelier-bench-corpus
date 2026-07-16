<?php

namespace Database\Factories;

use App\Models\BenchmarkTest;
use Illuminate\Database\Eloquent\Factories\Factory;

class BenchmarkTestFactory extends Factory
{
    protected $model = BenchmarkTest::class;

    public function definition(): array
    {
        return [
            'name' => 'test_' . $this->faker->unique()->slug(),
            'description' => $this->faker->paragraph(),
            'category' => $this->faker->randomElement(['performance', 'accuracy', 'reliability', 'scalability']),
            'is_active' => true,
            'version' => '1.0',
            'test_type' => $this->faker->randomElement(['unit', 'integration', 'performance', 'accuracy']),
        ];
    }
}
