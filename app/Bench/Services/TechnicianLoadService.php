<?php

namespace App\Bench\Services;

use App\Bench\Support\AbstractService;
use App\Bench\Concerns\HasLogging;
use App\Bench\Concerns\HasValidation;
use App\Bench\Repositories\TechnicianRepository;
use App\Bench\Repositories\OrderRepository;

class TechnicianLoadService extends AbstractService
{
    use HasLogging;
    use HasValidation;

    public function __construct(
        private readonly TechnicianRepository $technicianRepository,
        private readonly OrderRepository $orderRepository
    ) {
    }

    public function run(): array
    {
        $total = 0.0;
        $total += $this->technicianRepository->sum();
        $total += $this->orderRepository->sum();
        $this->log('TechnicianLoadService computed ' . $total);

        return ['total' => $this->assertPositive($total), 'records' => $this->records()];
    }

    public function records(): int
    {
        $n = 0;
        $n += $this->technicianRepository->count();
        $n += $this->orderRepository->count();
        return $n;
    }
}
