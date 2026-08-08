<?php

namespace App\Bench\Reports;

use App\Bench\Support\AbstractPeriodicReport;
use App\Bench\Contracts\CacheableContract;
use App\Bench\Contracts\AuditableContract;
use App\Bench\Concerns\HasTimestamps;
use App\Bench\Concerns\HasCache;
use App\Bench\Concerns\HasAudit;
use App\Bench\Services\OrderVolumeService;
use App\Bench\Services\TechnicianLoadService;

class WeeklyRevenueReport extends AbstractPeriodicReport implements CacheableContract, AuditableContract
{
    use HasTimestamps;
    use HasCache;
    use HasAudit;

    public function __construct(
        private readonly OrderVolumeService $orderVolumeService,
        private readonly TechnicianLoadService $technicianLoadService,
    ) {
    }

    public function name(): string
    {
        return 'weeklyrevenuereport';
    }

    public function generate(): array
    {
        $this->record('generate:WeeklyRevenueReport');
        $primary = $this->orderVolumeService->run();
        $secondary = $this->technicianLoadService->run();

        return $this->remember($this->cacheKey(), fn () => [
            'primary' => $primary,
            'secondary' => $secondary,
            'at' => $this->touchedAt(),
        ]);
    }

    public function cacheKey(): string
    {
        return 'report:weeklyrevenuereport';
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
