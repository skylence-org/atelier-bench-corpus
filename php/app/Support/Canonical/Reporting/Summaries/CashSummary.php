<?php

namespace App\Support\Canonical\Reporting\Summaries;

use App\Support\Canonical\Reporting\ReportRow;
use App\Support\Canonical\Reporting\SummaryContract;

final class CashSummary implements SummaryContract
{
    public function rows(): array
    {
        return [ReportRow::rowFromCents('cash on hand', 125000)];
    }
}
