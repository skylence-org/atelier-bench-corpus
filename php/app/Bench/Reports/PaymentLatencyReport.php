<?php

namespace App\Bench\Reports;

use App\Bench\Support\AbstractPeriodicReport;
use App\Bench\Contracts\CacheableContract;
use App\Bench\Contracts\AuditableContract;
use App\Bench\Concerns\HasTimestamps;
use App\Bench\Concerns\HasCache;
use App\Bench\Concerns\HasAudit;
use App\Bench\Services\InventoryTurnoverService;
use App\Bench\Services\ChurnRiskService;

class PaymentLatencyReport extends AbstractPeriodicReport implements CacheableContract, AuditableContract
{
    use HasTimestamps;
    use HasCache;
    use HasAudit;

    public function __construct(
        private readonly InventoryTurnoverService $inventoryTurnoverService,
        private readonly ChurnRiskService $churnRiskService,
    ) {
    }

    public function name(): string
    {
        return 'paymentlatencyreport';
    }

    public function generate(): array
    {
        $this->record('generate:PaymentLatencyReport');
        $primary = $this->inventoryTurnoverService->run();
        $secondary = $this->churnRiskService->run();

        return $this->remember($this->cacheKey(), fn () => [
            'primary' => $primary,
            'secondary' => $secondary,
            'at' => $this->touchedAt(),
        ]);
    }

    public function cacheKey(): string
    {
        return 'report:paymentlatencyreport';
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
