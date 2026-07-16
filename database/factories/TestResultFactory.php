<?php

namespace Database\Factories;

use App\Models\BenchmarkTest;
use App\Models\TestDataset;
use App\Models\TestResult;
use Illuminate\Database\Eloquent\Factories\Factory;

class TestResultFactory extends Factory
{
    protected $model = TestResult::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(['pending', 'running', 'passed', 'failed', 'error']);

        return [
            'benchmark_test_id' => BenchmarkTest::factory(),
            'test_dataset_id' => TestDataset::factory(),
            'status' => $status,
            'execution_time_ms' => $this->faker->randomFloat(2, 10, 5000),
            'memory_usage_mb' => $this->faker->randomFloat(2, 50, 2000),
            'cpu_usage_percent' => $this->faker->randomFloat(2, 5, 95),
            'accuracy_score' => $status === 'passed' ? $this->faker->randomFloat(2, 85, 100) : $this->faker->randomFloat(2, 40, 84),
            'notes' => $this->faker->optional()->sentence(),
            'run_metadata' => [
                'environment' => $this->faker->randomElement(['dev', 'staging', 'prod']),
                'runner' => 'automated',
                'duration_seconds' => $this->faker->numberBetween(1, 300),
            ],
            'executed_at' => $this->faker->dateTimeThisMonth(),
        ];
    }
}
