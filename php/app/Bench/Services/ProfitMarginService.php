<?php

namespace App\Bench\Services;

use App\Bench\Support\AbstractService;
use App\Bench\Concerns\HasLogging;
use App\Bench\Concerns\HasValidation;
use App\Bench\Repositories\InvoiceRepository;
use App\Bench\Repositories\PartRepository;
use App\Bench\Repositories\PaymentRepository;

class ProfitMarginService extends AbstractService
{
    use HasLogging;
    use HasValidation;

    public function __construct(
        private readonly InvoiceRepository $invoiceRepository,
        private readonly PartRepository $partRepository,
        private readonly PaymentRepository $paymentRepository
    ) {
    }

    public function run(): array
    {
        $total = 0.0;
        $total += $this->invoiceRepository->sum();
        $total += $this->partRepository->sum();
        $total += $this->paymentRepository->sum();
        $this->log('ProfitMarginService computed ' . $total);

        return ['total' => $this->assertPositive($total), 'records' => $this->records()];
    }

    public function records(): int
    {
        $n = 0;
        $n += $this->invoiceRepository->count();
        $n += $this->partRepository->count();
        $n += $this->paymentRepository->count();
        return $n;
    }
}
