<?php

namespace App\Console\Commands;

use App\Models\BenchmarkTest;
use App\Models\TestDataset;
use App\Services\BenchmarkExecutor;
use Illuminate\Console\Command;

class RunBenchmark extends Command
{
    protected $signature = 'benchmark:run {test_id? : Benchmark test ID} {dataset_id? : Test dataset ID}';
    protected $description = 'Execute a benchmark test';

    public function handle(BenchmarkExecutor $executor): int
    {
        $testId = $this->argument('test_id');
        $datasetId = $this->argument('dataset_id');

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

        if (!$datasetId) {
            $datasetId = $this->choice(
                'Select a test dataset:',
                $test->datasets->pluck('name', 'id')->all()
            );
        }

        $dataset = TestDataset::find($datasetId);
        if (!$dataset || $dataset->benchmark_test_id !== $test->id) {
            $this->error("Dataset not found or does not belong to this test");
            return 1;
        }

        $this->info("Running benchmark: {$test->name} with dataset: {$dataset->name}");

        $progressBar = $this->output->createProgressBar(1);
        $progressBar->start();

        $result = $executor->executeTest($test, $dataset);

        $progressBar->finish();
        $this->newLine();

        $this->info("Benchmark completed with status: {$result->status}");
        $this->table(
            ['Metric', 'Value'],
            [
                ['Execution Time', number_format($result->execution_time_ms ?? 0, 2) . ' ms'],
                ['Memory Usage', number_format($result->memory_usage_mb ?? 0, 2) . ' MB'],
                ['CPU Usage', number_format($result->cpu_usage_percent ?? 0, 2) . ' %'],
                ['Accuracy Score', number_format($result->accuracy_score ?? 0, 2)],
            ]
        );

        return 0;
    }
}
