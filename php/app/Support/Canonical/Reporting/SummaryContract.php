<?php

namespace App\Support\Canonical\Reporting;

interface SummaryContract
{
    /** @return list<ReportRow> */
    public function rows(): array;
}
