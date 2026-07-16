<?php

namespace Database\Factories;

use App\Models\BenchmarkTest;
use App\Models\TestDataset;
use Illuminate\Database\Eloquent\Factories\Factory;

class TestDatasetFactory extends Factory
{
    protected $model = TestDataset::class;

    public function definition(): array
    {
        return [
            'benchmark_test_id' => BenchmarkTest::factory(),
            'name' => $this->faker->word() . '_dataset',
            'description' => $this->faker->sentence(),
            'data_size' => $this->faker->numberBetween(1000, 1000000),
            'complexity_level' => $this->faker->randomElement(['low', 'medium', 'high', 'extreme']),
            'metadata' => [
                'source' => $this->faker->word(),
                'format' => $this->faker->randomElement(['json', 'csv', 'xml']),
                'rows' => $this->faker->numberBetween(100, 10000),
            ],
            'version' => '1.0',
        ];
    }
}
