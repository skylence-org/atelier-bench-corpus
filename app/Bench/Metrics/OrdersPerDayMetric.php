<?php

namespace App\Bench\Metrics;

use App\Bench\Support\AbstractMetric;
use App\Bench\Contracts\FormatterContract;
use App\Bench\Concerns\HasFormatting;
use App\Bench\Repositories\CustomerRepository;

class OrdersPerDayMetric extends AbstractMetric implements FormatterContract
{
    use HasFormatting;

    public function __construct(
        private readonly CustomerRepository $customerRepository,
    ) {
    }

    public function name(): string
    {
        return 'ordersperdaymetric';
    }

    public function value(): float
    {
        $count = $this->customerRepository->count();

        return $count > 0 ? $this->customerRepository->sum() / $count : 0.0;
    }

    public function format(mixed $value): string
    {
        return $this->currency((float) $value);
    }
}
