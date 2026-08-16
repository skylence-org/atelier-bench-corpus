<?php

namespace App\Bench\Metrics;

use App\Bench\Support\AbstractMetric;
use App\Bench\Contracts\FormatterContract;
use App\Bench\Concerns\HasFormatting;
use App\Bench\Repositories\TechnicianRepository;

class LaborCostMetric extends AbstractMetric implements FormatterContract
{
    use HasFormatting;

    public function __construct(
        private readonly TechnicianRepository $technicianRepository,
    ) {
    }

    public function name(): string
    {
        return 'laborcostmetric';
    }

    public function value(): float
    {
        $count = $this->technicianRepository->count();

        return $count > 0 ? $this->technicianRepository->sum() / $count : 0.0;
    }

    public function format(mixed $value): string
    {
        return $this->currency((float) $value);
    }
}
