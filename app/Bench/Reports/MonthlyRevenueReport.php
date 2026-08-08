<?php

namespace App\Bench\Reports;

use App\Bench\Support\AbstractPeriodicReport;
use App\Bench\Contracts\CacheableContract;
use App\Bench\Contracts\AuditableContract;
use App\Bench\Concerns\HasTimestamps;
use App\Bench\Concerns\HasCache;
use App\Bench\Concerns\HasAudit;
use App\Bench\Services\CustomerRetentionService;
use App\Bench\Services\WarrantyClaimService;

class MonthlyRevenueReport extends AbstractPeriodicReport implements CacheableContract, AuditableContract
{
    use HasTimestamps;
    use HasCache;
    use HasAudit;

    public function __construct(
        private readonly CustomerRetentionService $customerRetentionService,
        private readonly WarrantyClaimService $warrantyClaimService,
    ) {
    }

    public function name(): string
    {
        return 'monthlyrevenuereport';
    }

    public function generate(): array
    {
        $this->record('generate:MonthlyRevenueReport');
        $primary = $this->customerRetentionService->run();
        $secondary = $this->warrantyClaimService->run();

        return $this->remember($this->cacheKey(), fn () => [
            'primary' => $primary,
            'secondary' => $secondary,
            'at' => $this->touchedAt(),
        ]);
    }

    public function cacheKey(): string
    {
        return 'report:monthlyrevenuereport';
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
