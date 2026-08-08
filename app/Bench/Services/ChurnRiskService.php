<?php

namespace App\Bench\Services;

use App\Bench\Support\AbstractService;
use App\Bench\Concerns\HasLogging;
use App\Bench\Concerns\HasValidation;
use App\Bench\Repositories\CustomerRepository;
use App\Bench\Repositories\PaymentRepository;

class ChurnRiskService extends AbstractService
{
    use HasLogging;
    use HasValidation;

    public function __construct(
        private readonly CustomerRepository $customerRepository,
        private readonly PaymentRepository $paymentRepository
    ) {
    }

    public function run(): array
    {
        $total = 0.0;
        $total += $this->customerRepository->sum();
        $total += $this->paymentRepository->sum();
        $this->log('ChurnRiskService computed ' . $total);

        return ['total' => $this->assertPositive($total), 'records' => $this->records()];
    }

    public function records(): int
    {
        $n = 0;
        $n += $this->customerRepository->count();
        $n += $this->paymentRepository->count();
        return $n;
    }
}
