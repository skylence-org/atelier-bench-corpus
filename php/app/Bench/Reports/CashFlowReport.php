<?php

namespace App\Bench\Reports;

use App\Bench\Support\AbstractPeriodicReport;
use App\Bench\Contracts\CacheableContract;
use App\Bench\Contracts\AuditableContract;
use App\Bench\Concerns\HasTimestamps;
use App\Bench\Concerns\HasCache;
use App\Bench\Concerns\HasAudit;
use App\Bench\Services\ProfitMarginService;
use App\Bench\Services\BacklogService;

class CashFlowReport extends AbstractPeriodicReport implements CacheableContract, AuditableContract
{
    use HasTimestamps;
    use HasCache;
    use HasAudit;

    public function __construct(
        private readonly ProfitMarginService $profitMarginService,
        private readonly BacklogService $backlogService,
    ) {
    }

    public function name(): string
    {
        return 'cashflowreport';
    }

    public function generate(): array
    {
        $this->record('generate:CashFlowReport');
        $primary = $this->profitMarginService->run();
        $secondary = $this->backlogService->run();

        return $this->remember($this->cacheKey(), fn () => [
            'primary' => $primary,
            'secondary' => $secondary,
            'at' => $this->touchedAt(),
        ]);
    }

    public function cacheKey(): string
    {
        return 'report:cashflowreport';
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
