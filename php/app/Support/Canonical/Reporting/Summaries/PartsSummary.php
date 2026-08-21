<?php

namespace App\Support\Canonical\Reporting\Summaries;

use App\Support\Canonical\Reporting\ReportRow;
use App\Support\Canonical\Reporting\SummaryContract;

final class PartsSummary implements SummaryContract
{
    public function rows(): array
    {
        return [ReportRow::rowFromCents('parts sold', 61200)];
    }
}
