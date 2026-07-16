<?php

namespace App\Services;

use App\Contracts\InvoiceCalculator;
use App\Models\RepairOrder;
use Laravel\Pennant\Feature;

/**
 * Standard pricing plus a priority-weighted rush surcharge.
 *
 * Decorator-ish composition: constructor-promoted dependency on the OTHER
 * implementation, so call-hierarchy through calculate() has depth. The
 * surcharge sits behind a Pennant feature flag (facade-resolution surface).
 */
class RushInvoiceCalculator implements InvoiceCalculator
{
    public function __construct(
        private readonly StandardInvoiceCalculator $base,
    ) {}

    public function calculate(RepairOrder $order): int
    {
        $base = $this->base->calculate($order);

        if (! Feature::active('rush-surcharge')) {
            return $base;
        }

        $surchargePercent = 15 * $order->priority->weight();

        return $base + intdiv($base * $surchargePercent, 100);
    }
}
