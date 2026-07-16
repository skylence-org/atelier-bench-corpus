<?php

namespace App\Http\Controllers;

use App\Models\BenchmarkTest;
use App\Models\TestDataset;
use App\Models\TestResult;
use App\Services\BenchmarkAnalyzer;
use App\Services\BenchmarkExecutor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BenchmarkApiController extends Controller
{
    public function __construct(
        protected BenchmarkExecutor $executor,
        protected BenchmarkAnalyzer $analyzer
    ) {}

    public function listTests(): JsonResponse
    {
        $tests = BenchmarkTest::with(['datasets', 'results'])->get();

        return response()->json([
            'success' => true,
            'data' => $tests,
            'count' => $tests->count(),
        ]);
    }

    public function getTest(BenchmarkTest $test): JsonResponse
    {
        $test->load(['datasets', 'results.measurements']);

        return response()->json([
            'success' => true,
            'data' => $test,
        ]);
    }

    public function getDataset(TestDataset $dataset): JsonResponse
    {
        $dataset->load(['metrics', 'results.measurements']);

        return response()->json([
            'success' => true,
            'data' => $dataset,
        ]);
    }

    public function runTest(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'test_id' => 'required|exists:benchmark_tests,id',
            'dataset_id' => 'required|exists:test_datasets,id',
        ]);

        $test = BenchmarkTest::find($validated['test_id']);
        $dataset = TestDataset::find($validated['dataset_id']);

        if ($dataset->benchmark_test_id !== $test->id) {
            return response()->json([
                'success' => false,
                'error' => 'Dataset does not belong to this test',
            ], 400);
        }

        $result = $this->executor->executeTest($test, $dataset);

        return response()->json([
            'success' => true,
            'data' => $result->load('measurements'),
            'message' => 'Benchmark executed successfully',
        ]);
    }

    public function analyzeTest(BenchmarkTest $test): JsonResponse
    {
        $analysis = $this->analyzer->analyzeTestResults($test);
        $accuracyReport = $this->analyzer->getAccuracyReport($test);

        return response()->json([
            'success' => true,
            'data' => [
                'test_name' => $test->name,
                'analysis' => $analysis,
                'accuracy_report' => $accuracyReport,
            ],
        ]);
    }

    public function analyzeDataset(TestDataset $dataset): JsonResponse
    {
        $analysis = $this->analyzer->analyzeDatasetPerformance($dataset);

        return response()->json([
            'success' => true,
            'data' => $analysis,
        ]);
    }

    public function compareResults(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'result_id_1' => 'required|exists:test_results,id',
            'result_id_2' => 'required|exists:test_results,id',
        ]);

        $result1 = TestResult::find($validated['result_id_1']);
        $result2 = TestResult::find($validated['result_id_2']);

        $comparison = $this->analyzer->compareResults($result1, $result2);

        return response()->json([
            'success' => true,
            'data' => [
                'result_1' => $result1->only(['id', 'status', 'execution_time_ms', 'memory_usage_mb', 'accuracy_score']),
                'result_2' => $result2->only(['id', 'status', 'execution_time_ms', 'memory_usage_mb', 'accuracy_score']),
                'comparison' => $comparison,
            ],
        ]);
    }

    public function getResults(Request $request): JsonResponse
    {
        $query = TestResult::query();

        if ($request->has('test_id')) {
            $query->where('benchmark_test_id', $request->get('test_id'));
        }

        if ($request->has('dataset_id')) {
            $query->where('test_dataset_id', $request->get('dataset_id'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        $results = $query->with('measurements')->paginate($request->get('per_page', 25));

        return response()->json([
            'success' => true,
            'data' => $results,
        ]);
    }
}
