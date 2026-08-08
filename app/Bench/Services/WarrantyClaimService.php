<?php

namespace App\Bench\Services;

use App\Bench\Support\AbstractService;
use App\Bench\Concerns\HasLogging;
use App\Bench\Concerns\HasValidation;
use App\Bench\Repositories\WarrantyRepository;
use App\Bench\Repositories\InvoiceRepository;

class WarrantyClaimService extends AbstractService
{
    use HasLogging;
    use HasValidation;

    public function __construct(
        private readonly WarrantyRepository $warrantyRepository,
        private readonly InvoiceRepository $invoiceRepository
    ) {
    }

    public function run(): array
    {
        $total = 0.0;
        $total += $this->warrantyRepository->sum();
        $total += $this->invoiceRepository->sum();
        $this->log('WarrantyClaimService computed ' . $total);

        return ['total' => $this->assertPositive($total), 'records' => $this->records()];
    }

    public function records(): int
    {
        $n = 0;
        $n += $this->warrantyRepository->count();
        $n += $this->invoiceRepository->count();
        return $n;
    }
}
