<?php

namespace App\Support\Canonical\Reporting\Summaries;

use App\Support\Canonical\Reporting\ReportRow;
use App\Support\Canonical\Reporting\SummaryContract;

final class LaborSummary implements SummaryContract
{
    public function rows(): array
    {
        return [ReportRow::rowFromCents('labor billed', 84500)];
    }
}
