<?php

namespace App\Services;

use App\Contracts\InvoiceCalculator;
use App\Models\RepairOrder;

/**
 * Standard pricing plus a priority-weighted rush surcharge.
 *
 * Decorator-ish composition: constructor-promoted dependency on the OTHER
 * implementation, so call-hierarchy through calculate() has depth.
 */
class RushInvoiceCalculator implements InvoiceCalculator
{
    public function __construct(
        private readonly StandardInvoiceCalculator $base,
    ) {}

    public function calculate(RepairOrder $order): int
    {
        $surchargePercent = 15 * $order->priority->weight();

        $base = $this->base->calculate($order);

        return $base + intdiv($base * $surchargePercent, 100);
    }
}
