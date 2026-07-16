<?php

namespace App\Contracts;

use App\Models\RepairOrder;

/**
 * Invoice pricing contract.
 *
 * Interface-implementation coverage: two implementations (Standard, Rush)
 * plus a container binding in AppServiceProvider. "Who implements this" and
 * "definition through the interface" both have known answers.
 */
interface InvoiceCalculator
{
    /**
     * Total in cents for the given order.
     */
    public function calculate(RepairOrder $order): int;
}
