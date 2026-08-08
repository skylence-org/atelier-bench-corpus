<?php

namespace App\Bench\Reports;

use App\Bench\Support\AbstractPeriodicReport;
use App\Bench\Contracts\CacheableContract;
use App\Bench\Contracts\AuditableContract;
use App\Bench\Concerns\HasTimestamps;
use App\Bench\Concerns\HasCache;
use App\Bench\Concerns\HasAudit;
use App\Bench\Services\ThroughputService;
use App\Bench\Services\OrderVolumeService;

class InventoryTurnoverReport extends AbstractPeriodicReport implements CacheableContract, AuditableContract
{
    use HasTimestamps;
    use HasCache;
    use HasAudit;

    public function __construct(
        private readonly ThroughputService $throughputService,
        private readonly OrderVolumeService $orderVolumeService,
    ) {
    }

    public function name(): string
    {
        return 'inventoryturnoverreport';
    }

    public function generate(): array
    {
        $this->record('generate:InventoryTurnoverReport');
        $primary = $this->throughputService->run();
        $secondary = $this->orderVolumeService->run();

        return $this->remember($this->cacheKey(), fn () => [
            'primary' => $primary,
            'secondary' => $secondary,
            'at' => $this->touchedAt(),
        ]);
    }

    public function cacheKey(): string
    {
        return 'report:inventoryturnoverreport';
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
