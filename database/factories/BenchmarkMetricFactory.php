<?php

namespace Database\Factories;

use App\Models\BenchmarkMetric;
use App\Models\TestDataset;
use Illuminate\Database\Eloquent\Factories\Factory;

class BenchmarkMetricFactory extends Factory
{
    protected $model = BenchmarkMetric::class;

    public function definition(): array
    {
        $metricType = $this->faker->randomElement(['time', 'memory', 'cpu', 'accuracy', 'throughput']);
        
        return [
            'test_dataset_id' => TestDataset::factory(),
            'metric_name' => $metricType . '_' . $this->faker->word(),
            'metric_type' => $metricType,
            'expected_value' => match($metricType) {
                'time' => $this->faker->numberBetween(100, 5000),
                'memory' => $this->faker->numberBetween(50, 2000),
                'cpu' => $this->faker->numberBetween(5, 80),
                'accuracy' => $this->faker->numberBetween(80, 100),
                'throughput' => $this->faker->numberBetween(100, 10000),
            },
            'unit' => match($metricType) {
                'time' => 'ms',
                'memory' => 'mb',
                'cpu' => '%',
                'accuracy' => 'score',
                'throughput' => 'ops/sec',
            },
            'description' => $this->faker->sentence(),
            'threshold_warning' => $this->faker->optional()->randomFloat(2, 100, 500),
            'threshold_critical' => $this->faker->optional()->randomFloat(2, 500, 1000),
        ];
    }
}
