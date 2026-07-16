<?php

namespace App\Models;

use Database\Factories\BenchmarkMetricFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['test_dataset_id', 'metric_name', 'metric_type', 'expected_value', 'unit', 'description', 'threshold_warning', 'threshold_critical'])]
class BenchmarkMetric extends Model
{
    /** @use HasFactory<BenchmarkMetricFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'expected_value' => 'float',
            'threshold_warning' => 'float',
            'threshold_critical' => 'float',
        ];
    }

    public function testDataset(): BelongsTo
    {
        return $this->belongsTo(TestDataset::class);
    }
}
