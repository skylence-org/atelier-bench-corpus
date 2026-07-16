<?php

namespace App\Services;

use App\Models\BenchmarkTest;
use App\Models\TestDataset;
use App\Models\TestResult;
use Illuminate\Support\Collection;

class BenchmarkAnalyzer
{
    public function analyzeTestResults(BenchmarkTest $test): array
    {
        $results = $test->results()->with('measurements')->get();

        return [
            'total_runs' => $results->count(),
            'passed_runs' => $results->where('status', 'passed')->count(),
            'failed_runs' => $results->where('status', 'failed')->count(),
            'error_runs' => $results->where('status', 'error')->count(),
            'average_execution_time_ms' => $results->avg('execution_time_ms'),
            'min_execution_time_ms' => $results->min('execution_time_ms'),
            'max_execution_time_ms' => $results->max('execution_time_ms'),
            'average_memory_usage_mb' => $results->avg('memory_usage_mb'),
            'average_accuracy_score' => $results->avg('accuracy_score'),
            'consistency_score' => $this->calculateConsistency($results),
            'by_dataset' => $this->analyzeByDataset($test),
        ];
    }

    public function analyzeDatasetPerformance(TestDataset $dataset): array
    {
        $results = $dataset->results()->with('measurements')->get();

        if ($results->isEmpty()) {
            return [
                'dataset_name' => $dataset->name,
                'data_size' => $dataset->data_size,
                'complexity_level' => $dataset->complexity_level,
                'total_runs' => 0,
                'metrics' => [],
            ];
        }

        return [
            'dataset_name' => $dataset->name,
            'data_size' => $dataset->data_size,
            'complexity_level' => $dataset->complexity_level,
            'total_runs' => $results->count(),
            'pass_rate' => ($results->where('status', 'passed')->count() / $results->count()) * 100,
            'average_execution_time_ms' => $results->avg('execution_time_ms'),
            'standard_deviation_time' => $this->calculateStdDev($results->pluck('execution_time_ms')),
            'average_memory_usage_mb' => $results->avg('memory_usage_mb'),
            'metrics' => $this->analyzeMetricsForDataset($dataset, $results),
        ];
    }

    public function compareResults(TestResult $result1, TestResult $result2): array
    {
        $diff = [
            'execution_time_diff_ms' => $result2->execution_time_ms - $result1->execution_time_ms,
            'execution_time_diff_percent' => (($result2->execution_time_ms - $result1->execution_time_ms) / $result1->execution_time_ms) * 100,
            'memory_usage_diff_mb' => $result2->memory_usage_mb - $result1->memory_usage_mb,
            'memory_diff_percent' => (($result2->memory_usage_mb - $result1->memory_usage_mb) / $result1->memory_usage_mb) * 100,
            'accuracy_score_diff' => $result2->accuracy_score - $result1->accuracy_score,
        ];

        return $diff;
    }

    public function getAccuracyReport(BenchmarkTest $test): array
    {
        $results = $test->results()->with('measurements')->get();

        $measurements = $results->flatMap(fn($r) => $r->measurements);

        $passedMeasurements = $measurements->where('passed', true)->count();
        $totalMeasurements = $measurements->count();

        return [
            'test_name' => $test->name,
            'total_measurements' => $totalMeasurements,
            'passed_measurements' => $passedMeasurements,
            'failed_measurements' => $totalMeasurements - $passedMeasurements,
            'overall_pass_rate_percent' => $totalMeasurements > 0 ? ($passedMeasurements / $totalMeasurements) * 100 : 0,
            'average_variance_percent' => $measurements->avg('variance_percent'),
            'max_positive_variance_percent' => $measurements->max('variance_percent'),
            'max_negative_variance_percent' => $measurements->min('variance_percent'),
            'metric_breakdown' => $this->breakdownByMetric($measurements),
        ];
    }

    private function analyzeByDataset(BenchmarkTest $test): Collection
    {
        return $test->datasets->map(fn($dataset) => $this->analyzeDatasetPerformance($dataset));
    }

    private function analyzeMetricsForDataset(TestDataset $dataset, Collection $results): array
    {
        $metrics = [];

        foreach ($dataset->metrics as $metric) {
            $measurements = $results->flatMap(fn($r) => $r->measurements)
                ->where('metric_name', $metric->metric_name);

            $metrics[$metric->metric_name] = [
                'expected_value' => $metric->expected_value,
                'unit' => $metric->unit,
                'average_actual_value' => $measurements->avg('actual_value'),
                'passed_count' => $measurements->where('passed', true)->count(),
                'failed_count' => $measurements->where('passed', false)->count(),
                'average_variance_percent' => $measurements->avg('variance_percent'),
            ];
        }

        return $metrics;
    }

    private function breakdownByMetric(Collection $measurements): array
    {
        $grouped = $measurements->groupBy('metric_name');

        $breakdown = [];
        foreach ($grouped as $metricName => $metricMeasurements) {
            $breakdown[$metricName] = [
                'total' => $metricMeasurements->count(),
                'passed' => $metricMeasurements->where('passed', true)->count(),
                'failed' => $metricMeasurements->where('passed', false)->count(),
                'average_variance_percent' => $metricMeasurements->avg('variance_percent'),
            ];
        }

        return $breakdown;
    }

    private function calculateConsistency(Collection $results): float
    {
        $executionTimes = $results->pluck('execution_time_ms')->filter();
        if ($executionTimes->count() < 2) {
            return 100;
        }

        $stdDev = $this->calculateStdDev($executionTimes);
        $mean = $executionTimes->avg();

        $cv = ($stdDev / $mean) * 100;
        return max(0, 100 - $cv);
    }

    private function calculateStdDev(Collection $values): float
    {
        if ($values->count() < 2) {
            return 0;
        }

        $mean = $values->avg();
        $squaredDiffs = $values->map(fn($val) => pow($val - $mean, 2));

        return sqrt($squaredDiffs->avg());
    }
}
