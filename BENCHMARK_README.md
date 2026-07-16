# Filament Benchmark Corpus

A Laravel/Filament application for managing, running, and analyzing benchmark tests with accuracy scoring and performance metrics.
- **Filament Admin UI**: User-friendly interface for all operations
- **REST API**: Full API for programmatic access
- **CLI Commands**: Run and analyze benchmarks from command line

## Models

### BenchmarkTest
Represents a benchmark test suite with:
- name, description, category
- test_type (unit, integration, performance, accuracy)
- is_active flag
- version tracking

### TestDataset
Defines test data for benchmarks:
- name, description
- data_size (bytes or record count)
- complexity_level (low, medium, high, extreme)
- metadata (JSON)

### TestResult
Records test execution results:
- status (pending, running, passed, failed, error)
- execution_time_ms
- memory_usage_mb
- cpu_usage_percent
- accuracy_score (0-100)
- run_metadata (JSON)

### BenchmarkMetric
Defines expected metrics for test datasets:
- metric_name, metric_type
- expected_value, unit
- threshold_warning, threshold_critical

### Measurement
Individual measurements from test runs:
- metric_name, actual_value, unit
- passed (boolean)
- variance_percent (difference from expected)
### Test Results Analysis
Returns detailed statistics:
- Total/passed/failed/error run counts
- Average/min/max execution times
- Memory usage statistics
- Accuracy scores
- Consistency score (based on execution time variance)
- Per-dataset breakdown
php artisan migrate
```

2. **Seed benchmark data** (optional):
```bash
php artisan db:seed --class=BenchmarkSeeder
```

## Usage

### Via Filament Admin UI

1. Navigate to `/admin`
2. Browse Benchmark Tests, Test Datasets, and Test Results
3. Create new tests and datasets
4. View detailed analysis and metrics

### Via CLI Commands

**Run a benchmark test**:
```bash
php artisan benchmark:run {test_id} {dataset_id}
```

Interactive mode (prompts for test and dataset):
```bash
php artisan benchmark:run
```

**Analyze benchmark results**:
```bash
php artisan benchmark:analyze {test_id}
```

Interactive mode:
```bash
php artisan benchmark:analyze
```

### Via REST API

All benchmark operations are available through REST API at `/api/v1/benchmarks/`

**List all tests**:
```bash
GET /api/v1/benchmarks/
```

**Get specific test**:
```bash
GET /api/v1/benchmarks/{test_id}
```

**Run benchmark**:
```bash
POST /api/v1/benchmarks/run
{
    "test_id": 1,
    "dataset_id": 1
}
```

**Analyze test results**:
```bash
GET /api/v1/benchmarks/{test_id}/analyze
```

**Analyze dataset performance**:
```bash
GET /api/v1/datasets/{dataset_id}/analyze
```

**Compare two results**:
```bash
POST /api/v1/benchmarks/compare
{
    "result_id_1": 1,
    "result_id_2": 2
}
```

**Get test results** (with filtering):
```bash
GET /api/v1/benchmarks/results?test_id=1&dataset_id=1&status=passed
```

### Via PHP Code

Using helper functions:
```php
// Run a benchmark
$result = run_benchmark_test($test, $dataset);

// Analyze results
$analysis = analyze_test_results($test);

// Get accuracy report
$report = get_accuracy_report($test);
```

Using services directly:
```php
$executor = app(\App\Services\BenchmarkExecutor::class);
$analyzer = app(\App\Services\BenchmarkAnalyzer::class);

$result = $executor->executeTest($test, $dataset);
$analysis = $analyzer->analyzeTestResults($test);
```

## Analysis Features

### Test Results Analysis
Returns comprehensive statistics:
- Total/passed/failed/error run counts
- Average/min/max execution times
- Memory usage statistics
- Accuracy scores
- Consistency score (based on execution time variance)
- Per-dataset breakdown

### Dataset Performance Analysis
Analyzes performance on a specific dataset:
- Pass rate percentage
- Execution time statistics
- Memory usage metrics
- Individual metric performance
- Variance analysis

### Accuracy Reports
Detailed accuracy metrics:
- Measurement pass/fail counts
- Overall pass rate
- Variance statistics (average, min, max)
- Breakdown by metric

### Result Comparison
Compare two test results:
- Execution time difference
- Memory usage difference
- Accuracy score difference
- Percentage changes

## Database Structure

### benchmark_tests
- id, name, description, category
- is_active, version, test_type
- timestamps

### test_datasets
- id, benchmark_test_id
- name, description, data_size
- complexity_level, metadata, version
- timestamps

### test_results
- id, benchmark_test_id, test_dataset_id
- status, execution_time_ms, memory_usage_mb
- cpu_usage_percent, accuracy_score
- notes, run_metadata, executed_at
- timestamps

### benchmark_metrics
- id, test_dataset_id
- metric_name, metric_type
- expected_value, unit
- threshold_warning, threshold_critical
- timestamps

### measurements
- id, test_result_id
- metric_name, actual_value, unit
- passed, variance_percent
- timestamps

## Seeding Data

The BenchmarkSeeder creates sample data:
- 5 benchmark tests
- 3 datasets per test
- 4 metrics per dataset
- 6 results per dataset
- 4 measurements per result

Total: ~360 records for testing

Customize by editing `database/seeders/BenchmarkSeeder.php`

## Configuration

Factories use sensible defaults. Customize in `database/factories/`:
- BenchmarkTestFactory.php
- TestDatasetFactory.php
- TestResultFactory.php
- BenchmarkMetricFactory.php
- MeasurementFactory.php

## Performance Considerations

- Indexes on frequently queried columns (status, complexity_level, etc.)
- Cascade delete for referential integrity
- JSON columns for flexible metadata storage
- Efficient relationship loading in API

## Best Practices

1. **Organize by category**: Use meaningful categories for test grouping
2. **Set thresholds**: Define warning/critical thresholds for metrics
3. **Regular runs**: Schedule benchmark runs to track performance over time
4. **Version tracking**: Increment versions when test logic changes
5. **Metadata usage**: Store environment and runtime details in metadata
6. **Archive results**: Keep historical results for trend analysis

## Testing

Run tests with:
```bash
php artisan test
```

Key areas covered:
- Model relationships
- Service logic
- API endpoints
- Command execution
- Data validation

## Troubleshooting

**Tests not running**: Check BenchmarkTest and TestDataset exist and are associated

**Metrics not recording**: Ensure BenchmarkMetric rows exist for the dataset

**Accuracy score is null**: May occur if no metrics are defined; check threshold logic

**API 404 errors**: Verify routes are registered and model IDs exist

## Future Enhancements

- Real-time benchmark execution with WebSockets
- Benchmark scheduling with Laravel queues
- Advanced filtering and search
- Performance trend charts and graphs
- Automated alert thresholds
- Benchmark comparison reports
- Export functionality (CSV, PDF)
- Multi-environment support
- Team collaboration features
