<?php

namespace App\Bench\Metrics;

use App\Bench\Support\AbstractMetric;
use App\Bench\Contracts\FormatterContract;
use App\Bench\Concerns\HasFormatting;
use App\Bench\Repositories\PaymentRepository;

class PartCostMetric extends AbstractMetric implements FormatterContract
{
    use HasFormatting;

    public function __construct(
        private readonly PaymentRepository $paymentRepository,
    ) {
    }

    public function name(): string
    {
        return 'partcostmetric';
    }

    public function value(): float
    {
        $count = $this->paymentRepository->count();

        return $count > 0 ? $this->paymentRepository->sum() / $count : 0.0;
    }

    public function format(mixed $value): string
    {
        return $this->currency((float) $value);
    }
}
