<?php

/**
 * Global helper surface for the bench corpus.
 *
 * Deliberate coverage: a top-level const and a global function, both consumed
 * from multiple namespaces (trait, seeder, service). Exercises global-symbol
 * definition/references resolution (acuity #67 const coverage, #237 globals).
 */

const ATELIER_REF_PREFIX = 'AT';

if (! function_exists('atelier_format_reference')) {
    /**
     * Format a workshop reference like "AT-2026-000123".
     *
     * The zero-padded width is deliberately a magic number consumed nowhere
     * else, so hover on this function has a unique docblock to assert on.
     */
    function atelier_format_reference(string $prefix, int $number): string
    {
        return sprintf('%s%s%d%s%06d', $prefix, \App\Support\Reference::PREFIX_SEPARATOR, now()->year, \App\Support\Reference::PREFIX_SEPARATOR, $number);
    }
}

if (! function_exists('benchmark_executor')) {
    function benchmark_executor(): \App\Services\BenchmarkExecutor
    {
        return app(\App\Services\BenchmarkExecutor::class);
    }
}

if (! function_exists('benchmark_analyzer')) {
    function benchmark_analyzer(): \App\Services\BenchmarkAnalyzer
    {
        return app(\App\Services\BenchmarkAnalyzer::class);
    }
}

if (! function_exists('run_benchmark_test')) {
    function run_benchmark_test(\App\Models\BenchmarkTest $test, \App\Models\TestDataset $dataset): \App\Models\TestResult
    {
        return benchmark_executor()->executeTest($test, $dataset);
    }
}

if (! function_exists('analyze_test_results')) {
    function analyze_test_results(\App\Models\BenchmarkTest $test): array
    {
        return benchmark_analyzer()->analyzeTestResults($test);
    }
}

if (! function_exists('get_accuracy_report')) {
    function get_accuracy_report(\App\Models\BenchmarkTest $test): array
    {
        return benchmark_analyzer()->getAccuracyReport($test);
    }
}
