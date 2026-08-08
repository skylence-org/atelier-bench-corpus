<?php

namespace App\Bench\Metrics;

use App\Bench\Support\AbstractMetric;
use App\Bench\Contracts\FormatterContract;
use App\Bench\Concerns\HasFormatting;
use App\Bench\Repositories\InventoryRepository;

class NpsMetric extends AbstractMetric implements FormatterContract
{
    use HasFormatting;

    public function __construct(
        private readonly InventoryRepository $inventoryRepository,
    ) {
    }

    public function name(): string
    {
        return 'npsmetric';
    }

    public function value(): float
    {
        $count = $this->inventoryRepository->count();

        return $count > 0 ? $this->inventoryRepository->sum() / $count : 0.0;
    }

    public function format(mixed $value): string
    {
        return $this->currency((float) $value);
    }
}
