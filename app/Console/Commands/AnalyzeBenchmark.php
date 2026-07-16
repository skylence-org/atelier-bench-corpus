<?php

namespace App\Console\Commands;

use App\Models\BenchmarkTest;
use App\Services\BenchmarkAnalyzer;
use Illuminate\Console\Command;

class AnalyzeBenchmark extends Command
{
    protected $signature = 'benchmark:analyze {test_id? : Benchmark test ID}';
    protected $description = 'Analyze benchmark test results';

    public function handle(BenchmarkAnalyzer $analyzer): int
    {
        $testId = $this->argument('test_id');

        if (!$testId) {
            $testId = $this->choice(
                'Select a benchmark test:',
                BenchmarkTest::pluck('name', 'id')->all()
            );
        }

        $test = BenchmarkTest::find($testId);
        if (!$test) {
            $this->error("Test not found");
            return 1;
        }

        $this->info("Analyzing benchmark: {$test->name}");
        $this->newLine();

        $analysis = $analyzer->analyzeTestResults($test);
        $accuracyReport = $analyzer->getAccuracyReport($test);

        $this->info('=== Test Results Summary ===');
        $this->table(
            ['Metric', 'Value'],
            [
                ['Total Runs', $analysis['total_runs']],
                ['Passed Runs', $analysis['passed_runs']],
                ['Failed Runs', $analysis['failed_runs']],
                ['Error Runs', $analysis['error_runs']],
                ['Avg Execution Time', number_format($analysis['average_execution_time_ms'], 2) . ' ms'],
                ['Min Execution Time', number_format($analysis['min_execution_time_ms'], 2) . ' ms'],
                ['Max Execution Time', number_format($analysis['max_execution_time_ms'], 2) . ' ms'],
                ['Avg Memory Usage', number_format($analysis['average_memory_usage_mb'], 2) . ' MB'],
                ['Avg Accuracy Score', number_format($analysis['average_accuracy_score'], 2)],
                ['Consistency Score', number_format($analysis['consistency_score'], 2)],
            ]
        );

        $this->newLine();
        $this->info('=== Accuracy Report ===');
        $this->table(
            ['Metric', 'Value'],
            [
                ['Total Measurements', $accuracyReport['total_measurements']],
                ['Passed Measurements', $accuracyReport['passed_measurements']],
                ['Failed Measurements', $accuracyReport['failed_measurements']],
                ['Overall Pass Rate', number_format($accuracyReport['overall_pass_rate_percent'], 2) . '%'],
                ['Avg Variance', number_format($accuracyReport['average_variance_percent'], 2) . '%'],
                ['Max Positive Variance', number_format($accuracyReport['max_positive_variance_percent'], 2) . '%'],
                ['Max Negative Variance', number_format($accuracyReport['max_negative_variance_percent'], 2) . '%'],
            ]
        );

        if (!empty($accuracyReport['metric_breakdown'])) {
            $this->newLine();
            $this->info('=== Metric Breakdown ===');
            $breakdown = [];
            foreach ($accuracyReport['metric_breakdown'] as $metric => $stats) {
                $breakdown[] = [
                    $metric,
                    $stats['passed'],
                    $stats['failed'],
                    number_format($stats['average_variance_percent'], 2) . '%',
                ];
            }
            $this->table(['Metric', 'Passed', 'Failed', 'Avg Variance'], $breakdown);
        }

        return 0;
    }
}
