<?php

namespace App\Models;

use Database\Factories\TestResultFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['benchmark_test_id', 'test_dataset_id', 'status', 'execution_time_ms', 'memory_usage_mb', 'cpu_usage_percent', 'accuracy_score', 'notes', 'run_metadata'])]
class TestResult extends Model
{
    /** @use HasFactory<TestResultFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'executed_at' => 'datetime',
            'run_metadata' => 'json',
        ];
    }

    public function benchmarkTest(): BelongsTo
    {
        return $this->belongsTo(BenchmarkTest::class);
    }

    public function testDataset(): BelongsTo
    {
        return $this->belongsTo(TestDataset::class);
    }

    public function measurements(): HasMany
    {
        return $this->hasMany(Measurement::class);
    }
}
