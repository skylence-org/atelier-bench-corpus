<?php

namespace App\Support\Canonical\Reporting\Summaries;

use App\Support\Canonical\Reporting\ReportRow;
use App\Support\Canonical\Reporting\SummaryContract;

final class WarrantySummary implements SummaryContract
{
    public function rows(): array
    {
        return [ReportRow::rowFromCents('warranty cost', 15400)];
    }
}
