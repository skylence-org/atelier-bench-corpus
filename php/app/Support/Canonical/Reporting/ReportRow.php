<?php

namespace App\Support\Canonical\Reporting;

/**
 * One labelled money row of a canonical summary.
 *
 * rowFromCents() is the canonical fan-in helper: the eight summaries under
 * Summaries/ call it and nothing else builds a ReportRow.
 */
final class ReportRow
{
    public function __construct(
        public readonly string $label,
        public readonly int $cents,
    ) {}

    public static function rowFromCents(string $label, int $cents): self
    {
        return new self($label, $cents);
    }
}
