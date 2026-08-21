<?php

namespace App\Support\Canonical\Reporting\Summaries;

use App\Support\Canonical\Reporting\ReportRow;
use App\Support\Canonical\Reporting\SummaryContract;

final class TaxSummary implements SummaryContract
{
    public function rows(): array
    {
        return [ReportRow::rowFromCents('tax collected', 22150)];
    }
}
