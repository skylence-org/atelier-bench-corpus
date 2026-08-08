<?php

namespace App\Bench\Reports;

use App\Bench\Support\AbstractPeriodicReport;
use App\Bench\Contracts\CacheableContract;
use App\Bench\Contracts\AuditableContract;
use App\Bench\Concerns\HasTimestamps;
use App\Bench\Concerns\HasCache;
use App\Bench\Concerns\HasAudit;
use App\Bench\Services\PartUsageService;
use App\Bench\Services\InventoryTurnoverService;

class WarrantyClaimReport extends AbstractPeriodicReport implements CacheableContract, AuditableContract
{
    use HasTimestamps;
    use HasCache;
    use HasAudit;

    public function __construct(
        private readonly PartUsageService $partUsageService,
        private readonly InventoryTurnoverService $inventoryTurnoverService,
    ) {
    }

    public function name(): string
    {
        return 'warrantyclaimreport';
    }

    public function generate(): array
    {
        $this->record('generate:WarrantyClaimReport');
        $primary = $this->partUsageService->run();
        $secondary = $this->inventoryTurnoverService->run();

        return $this->remember($this->cacheKey(), fn () => [
            'primary' => $primary,
            'secondary' => $secondary,
            'at' => $this->touchedAt(),
        ]);
    }

    public function cacheKey(): string
    {
        return 'report:warrantyclaimreport';
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
