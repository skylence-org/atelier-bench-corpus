<?php

namespace App\Bench\Reports;

use App\Bench\Support\AbstractPeriodicReport;
use App\Bench\Contracts\CompositeContract;
use App\Bench\Contracts\AuditableContract;
use App\Bench\Concerns\HasAudit;

/**
 * Multi-parent surface: one extends + two implements in a single declaration.
 */
class CompositeSummaryReport extends AbstractPeriodicReport implements CompositeContract, AuditableContract
{
    use HasAudit;

    public function generate(): array
    {
        $this->record('generate:CompositeSummaryReport');

        return ['ok' => true];
    }

    public function cacheKey(): string
    {
        return 'report:compositesummaryreport';
    }

    public function ttl(): int
    {
        return self::CACHE_TTL;
    }

    public function auditTrail(): array
    {
        return $this->trail;
    }
}
