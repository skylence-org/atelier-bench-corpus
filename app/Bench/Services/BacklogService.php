<?php

namespace App\Bench\Services;

use App\Bench\Support\AbstractService;
use App\Bench\Concerns\HasLogging;
use App\Bench\Concerns\HasValidation;
use App\Bench\Repositories\OrderRepository;
use App\Bench\Repositories\PartRepository;

class BacklogService extends AbstractService
{
    use HasLogging;
    use HasValidation;

    public function __construct(
        private readonly OrderRepository $orderRepository,
        private readonly PartRepository $partRepository
    ) {
    }

    public function run(): array
    {
        $total = 0.0;
        $total += $this->orderRepository->sum();
        $total += $this->partRepository->sum();
        $this->log('BacklogService computed ' . $total);

        return ['total' => $this->assertPositive($total), 'records' => $this->records()];
    }

    public function records(): int
    {
        $n = 0;
        $n += $this->orderRepository->count();
        $n += $this->partRepository->count();
        return $n;
    }
}
