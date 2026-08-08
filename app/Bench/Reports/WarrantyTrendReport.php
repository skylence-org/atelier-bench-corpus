<?php

namespace App\Bench\Reports;

use App\Bench\Support\AbstractPeriodicReport;
use App\Bench\Contracts\CacheableContract;
use App\Bench\Contracts\AuditableContract;
use App\Bench\Concerns\HasTimestamps;
use App\Bench\Concerns\HasCache;
use App\Bench\Concerns\HasAudit;
use App\Bench\Services\WarrantyClaimService;
use App\Bench\Services\ProfitMarginService;

class WarrantyTrendReport extends AbstractPeriodicReport implements CacheableContract, AuditableContract
{
    use HasTimestamps;
    use HasCache;
    use HasAudit;

    public function __construct(
        private readonly WarrantyClaimService $warrantyClaimService,
        private readonly ProfitMarginService $profitMarginService,
    ) {
    }

    public function name(): string
    {
        return 'warrantytrendreport';
    }

    public function generate(): array
    {
        $this->record('generate:WarrantyTrendReport');
        $primary = $this->warrantyClaimService->run();
        $secondary = $this->profitMarginService->run();

        return $this->remember($this->cacheKey(), fn () => [
            'primary' => $primary,
            'secondary' => $secondary,
            'at' => $this->touchedAt(),
        ]);
    }

    public function cacheKey(): string
    {
        return 'report:warrantytrendreport';
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
