<?php

/*
 * Bench-corpus domain config. config('atelier.*') string references are
 * text-search territory by design: the boundary between semantic and grep
 * tooling is itself a benchmark subject.
 */
return [
    'ref_prefix' => env('ATELIER_REF_PREFIX', ATELIER_REF_PREFIX),

    // Flat labor charge applied by StandardInvoiceCalculator, in cents.
    'labor_rate_cents' => env('ATELIER_LABOR_RATE_CENTS', 4500),
];
