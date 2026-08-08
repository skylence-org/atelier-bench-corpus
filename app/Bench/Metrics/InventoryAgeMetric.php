<?php

namespace App\Bench\Metrics;

use App\Bench\Support\AbstractMetric;
use App\Bench\Contracts\FormatterContract;
use App\Bench\Concerns\HasFormatting;
use App\Bench\Repositories\OrderRepository;

class InventoryAgeMetric extends AbstractMetric implements FormatterContract
{
    use HasFormatting;

    public function __construct(
        private readonly OrderRepository $orderRepository,
    ) {
    }

    public function name(): string
    {
        return 'inventoryagemetric';
    }

    public function value(): float
    {
        $count = $this->orderRepository->count();

        return $count > 0 ? $this->orderRepository->sum() / $count : 0.0;
    }

    public function format(mixed $value): string
    {
        return $this->currency((float) $value);
    }
}
