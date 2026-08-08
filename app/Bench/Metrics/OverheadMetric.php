<?php

namespace App\Bench\Metrics;

use App\Bench\Support\AbstractMetric;
use App\Bench\Contracts\FormatterContract;
use App\Bench\Concerns\HasFormatting;
use App\Bench\Repositories\WarrantyRepository;

class OverheadMetric extends AbstractMetric implements FormatterContract
{
    use HasFormatting;

    public function __construct(
        private readonly WarrantyRepository $warrantyRepository,
    ) {
    }

    public function name(): string
    {
        return 'overheadmetric';
    }

    public function value(): float
    {
        $count = $this->warrantyRepository->count();

        return $count > 0 ? $this->warrantyRepository->sum() / $count : 0.0;
    }

    public function format(mixed $value): string
    {
        return $this->currency((float) $value);
    }
}
