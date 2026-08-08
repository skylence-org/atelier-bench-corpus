<?php

namespace App\Bench\Services;

use App\Bench\Support\AbstractService;
use App\Bench\Concerns\HasLogging;
use App\Bench\Concerns\HasValidation;
use App\Bench\Repositories\OrderRepository;
use App\Bench\Repositories\TechnicianRepository;

class ThroughputService extends AbstractService
{
    use HasLogging;
    use HasValidation;

    public function __construct(
        private readonly OrderRepository $orderRepository,
        private readonly TechnicianRepository $technicianRepository
    ) {
    }

    public function run(): array
    {
        $total = 0.0;
        $total += $this->orderRepository->sum();
        $total += $this->technicianRepository->sum();
        $this->log('ThroughputService computed ' . $total);

        return ['total' => $this->assertPositive($total), 'records' => $this->records()];
    }

    public function records(): int
    {
        $n = 0;
        $n += $this->orderRepository->count();
        $n += $this->technicianRepository->count();
        return $n;
    }
}
