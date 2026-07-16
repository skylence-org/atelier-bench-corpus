<?php

namespace App\Models;

use Database\Factories\TestDatasetFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['benchmark_test_id', 'name', 'description', 'data_size', 'complexity_level', 'metadata', 'version'])]
class TestDataset extends Model
{
    /** @use HasFactory<TestDatasetFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'metadata' => 'json',
        ];
    }

    public function benchmarkTest(): BelongsTo
    {
        return $this->belongsTo(BenchmarkTest::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(TestResult::class);
    }

    public function metrics(): HasMany
    {
        return $this->hasMany(BenchmarkMetric::class);
    }
}
