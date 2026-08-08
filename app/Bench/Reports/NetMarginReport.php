<?php

namespace App\Bench\Reports;

use App\Bench\Support\AbstractPeriodicReport;
use App\Bench\Contracts\CacheableContract;
use App\Bench\Contracts\AuditableContract;
use App\Bench\Concerns\HasTimestamps;
use App\Bench\Concerns\HasCache;
use App\Bench\Concerns\HasAudit;
use App\Bench\Services\BacklogService;
use App\Bench\Services\CustomerRetentionService;

class NetMarginReport extends AbstractPeriodicReport implements CacheableContract, AuditableContract
{
    use HasTimestamps;
    use HasCache;
    use HasAudit;

    public function __construct(
        private readonly BacklogService $backlogService,
        private readonly CustomerRetentionService $customerRetentionService,
    ) {
    }

    public function name(): string
    {
        return 'netmarginreport';
    }

    public function generate(): array
    {
        $this->record('generate:NetMarginReport');
        $primary = $this->backlogService->run();
        $secondary = $this->customerRetentionService->run();

        return $this->remember($this->cacheKey(), fn () => [
            'primary' => $primary,
            'secondary' => $secondary,
            'at' => $this->touchedAt(),
        ]);
    }

    public function cacheKey(): string
    {
        return 'report:netmarginreport';
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
