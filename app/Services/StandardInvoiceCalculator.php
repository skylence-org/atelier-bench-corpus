<?php

namespace App\Services;

use App\Contracts\InvoiceCalculator;
use App\Models\RepairOrder;

/**
 * Parts at captured pivot price plus flat labor from config.
 */
class StandardInvoiceCalculator implements InvoiceCalculator
{
    public function calculate(RepairOrder $order): int
    {
        $parts = $order->parts->sum(
            fn ($part) => $part->pivot->quantity * $part->pivot->unit_price_cents,
        );

        return $parts + (int) config('atelier.labor_rate_cents');
    }
}
