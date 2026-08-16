<?php

namespace App\Bench\Reports;

use App\Bench\Support\AbstractPeriodicReport;
use App\Bench\Contracts\CacheableContract;
use App\Bench\Contracts\AuditableContract;
use App\Bench\Concerns\HasTimestamps;
use App\Bench\Concerns\HasCache;
use App\Bench\Concerns\HasAudit;
use App\Bench\Services\ChurnRiskService;
use App\Bench\Services\RevenueService;

class PartUsageReport extends AbstractPeriodicReport implements CacheableContract, AuditableContract
{
    use HasTimestamps;
    use HasCache;
    use HasAudit;

    public function __construct(
        private readonly ChurnRiskService $churnRiskService,
        private readonly RevenueService $revenueService,
    ) {
    }

    public function name(): string
    {
        return 'partusagereport';
    }

    public function generate(): array
    {
        $this->record('generate:PartUsageReport');
        $primary = $this->churnRiskService->run();
        $secondary = $this->revenueService->run();

        return $this->remember($this->cacheKey(), fn () => [
            'primary' => $primary,
            'secondary' => $secondary,
            'at' => $this->touchedAt(),
        ]);
    }

    public function cacheKey(): string
    {
        return 'report:partusagereport';
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
