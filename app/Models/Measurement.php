<?php

namespace App\Models;

use Database\Factories\MeasurementFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['test_result_id', 'metric_name', 'actual_value', 'unit', 'passed', 'variance_percent'])]
class Measurement extends Model
{
    /** @use HasFactory<MeasurementFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'actual_value' => 'float',
            'passed' => 'boolean',
            'variance_percent' => 'float',
        ];
    }

    public function testResult(): BelongsTo
    {
        return $this->belongsTo(TestResult::class);
    }
}
