<?php

namespace Database\Factories;

use App\Models\Measurement;
use App\Models\TestResult;
use Illuminate\Database\Eloquent\Factories\Factory;

class MeasurementFactory extends Factory
{
    protected $model = Measurement::class;

    public function definition(): array
    {
        $passed = $this->faker->boolean(75);
        
        return [
            'test_result_id' => TestResult::factory(),
            'metric_name' => $this->faker->word() . '_metric',
            'actual_value' => $this->faker->randomFloat(2, 10, 5000),
            'unit' => $this->faker->randomElement(['ms', 'mb', '%', 'score', 'ops/sec']),
            'passed' => $passed,
            'variance_percent' => $this->faker->randomFloat(2, -50, $passed ? 50 : 200),
        ];
    }
}
