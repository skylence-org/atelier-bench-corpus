<?php

namespace App\Bench\Reports;

use App\Bench\Support\AbstractPeriodicReport;
use App\Bench\Contracts\CacheableContract;
use App\Bench\Contracts\AuditableContract;
use App\Bench\Concerns\HasTimestamps;
use App\Bench\Concerns\HasCache;
use App\Bench\Concerns\HasAudit;
use App\Bench\Services\TechnicianLoadService;
use App\Bench\Services\PaymentLatencyService;

class WarrantyCostReport extends AbstractPeriodicReport implements CacheableContract, AuditableContract
{
    use HasTimestamps;
    use HasCache;
    use HasAudit;

    public function __construct(
        private readonly TechnicianLoadService $technicianLoadService,
        private readonly PaymentLatencyService $paymentLatencyService,
    ) {
    }

    public function name(): string
    {
        return 'warrantycostreport';
    }

    public function generate(): array
    {
        $this->record('generate:WarrantyCostReport');
        $primary = $this->technicianLoadService->run();
        $secondary = $this->paymentLatencyService->run();

        return $this->remember($this->cacheKey(), fn () => [
            'primary' => $primary,
            'secondary' => $secondary,
            'at' => $this->touchedAt(),
        ]);
    }

    public function cacheKey(): string
    {
        return 'report:warrantycostreport';
    }

    public function ttl(): int
    {
        return 3600;
    }

    public function auditTrail(): array
    {
        return $this->trail;
    }
}
