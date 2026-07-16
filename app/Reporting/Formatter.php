<?php

namespace App\Reporting;

use App\Enums\RepairStatus;

/**
 * The other half of the same-name pair (see App\Billing\Formatter).
 *
 * Resolution must land HERE for the ReportingFormatter alias; a tool that
 * matches by bare class name conflates the two.
 */
class Formatter
{
    /**
     * "Repairing since 2026-07-01" status line for the report view.
     */
    public function statusLine(RepairStatus $status, ?string $since): string
    {
        return trim(sprintf('%s%s', $status->label(), $since ? " since {$since}" : ''));
    }
}
