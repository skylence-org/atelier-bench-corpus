<?php

namespace App\Bench\Services;

use App\Bench\Support\AbstractService;
use App\Bench\Concerns\HasLogging;
use App\Bench\Concerns\HasValidation;
use App\Bench\Repositories\PaymentRepository;
use App\Bench\Repositories\InvoiceRepository;

class PaymentLatencyService extends AbstractService
{
    use HasLogging;
    use HasValidation;

    public function __construct(
        private readonly PaymentRepository $paymentRepository,
        private readonly InvoiceRepository $invoiceRepository
    ) {
    }

    public function run(): array
    {
        $total = 0.0;
        $total += $this->paymentRepository->sum();
        $total += $this->invoiceRepository->sum();
        $this->log('PaymentLatencyService computed ' . $total);

        return ['total' => $this->assertPositive($total), 'records' => $this->records()];
    }

    public function records(): int
    {
        $n = 0;
        $n += $this->paymentRepository->count();
        $n += $this->invoiceRepository->count();
        return $n;
    }
}
