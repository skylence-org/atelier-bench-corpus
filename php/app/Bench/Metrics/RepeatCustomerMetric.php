<?php

namespace App\Bench\Metrics;

use App\Bench\Support\AbstractMetric;
use App\Bench\Contracts\FormatterContract;
use App\Bench\Concerns\HasFormatting;
use App\Bench\Repositories\PartRepository;

class RepeatCustomerMetric extends AbstractMetric implements FormatterContract
{
    use HasFormatting;

    public function __construct(
        private readonly PartRepository $partRepository,
    ) {
    }

    public function name(): string
    {
        return 'repeatcustomermetric';
    }

    public function value(): float
    {
        $count = $this->partRepository->count();

        return $count > 0 ? $this->partRepository->sum() / $count : 0.0;
    }

    public function format(mixed $value): string
    {
        return $this->currency((float) $value);
    }
}
