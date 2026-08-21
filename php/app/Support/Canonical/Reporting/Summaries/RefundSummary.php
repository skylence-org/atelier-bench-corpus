<?php

namespace App\Support\Canonical\Reporting\Summaries;

use App\Support\Canonical\Reporting\ReportRow;
use App\Support\Canonical\Reporting\SummaryContract;

final class RefundSummary implements SummaryContract
{
    public function rows(): array
    {
        return [ReportRow::rowFromCents('refunds issued', 9800)];
    }
}
