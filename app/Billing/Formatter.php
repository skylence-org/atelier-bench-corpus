<?php

namespace App\Billing;

/**
 * One half of the deliberate same-name pair (see App\Reporting\Formatter).
 *
 * Shadow/alias coverage (acuity #250 class): two classes named Formatter in
 * different namespaces, both imported under aliases into ReportController.
 * Resolution must land HERE for the BillingFormatter alias.
 */
class Formatter
{
    /**
     * "12.34 EUR" money rendering for invoices.
     */
    public function money(string $decimal, string $currency = 'EUR'): string
    {
        return sprintf('%s %s', $decimal, $currency);
    }
}
