<?php

namespace App\Bench\Reports;

use App\Bench\Support\AbstractPeriodicReport;
use App\Bench\Contracts\CacheableContract;
use App\Bench\Contracts\AuditableContract;
use App\Bench\Concerns\HasTimestamps;
use App\Bench\Concerns\HasCache;
use App\Bench\Concerns\HasAudit;
use App\Bench\Services\RevenueService;
use App\Bench\Services\PartUsageService;

class TechnicianLoadReport extends AbstractPeriodicReport implements CacheableContract, AuditableContract
{
    use HasTimestamps;
    use HasCache;
    use HasAudit;

    public function __construct(
        private readonly RevenueService $revenueService,
        private readonly PartUsageService $partUsageService,
    ) {
    }

    public function name(): string
    {
        return 'technicianloadreport';
    }

    public function generate(): array
    {
        $this->record('generate:TechnicianLoadReport');
        $primary = $this->revenueService->run();
        $secondary = $this->partUsageService->run();

        return $this->remember($this->cacheKey(), fn () => [
            'primary' => $primary,
            'secondary' => $secondary,
            'at' => $this->touchedAt(),
        ]);
    }

    public function cacheKey(): string
    {
        return 'report:technicianloadreport';
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
