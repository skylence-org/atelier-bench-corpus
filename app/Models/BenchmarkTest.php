<?php

namespace App\Models;

use Database\Factories\BenchmarkTestFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'description', 'category', 'is_active', 'version', 'test_type'])]
class BenchmarkTest extends Model
{
    /** @use HasFactory<BenchmarkTestFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function datasets(): HasMany
    {
        return $this->hasMany(TestDataset::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(TestResult::class);
    }
}
