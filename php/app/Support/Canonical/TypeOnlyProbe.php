<?php

namespace App\Support\Canonical;

use App\Models\RepairOrder;

/**
 * imp-type-only-no-value-edge: the import above is consumed ONLY by the
 * docblock below. No runtime edge to RepairOrder exists in this file -- the
 * parameter is typed mixed on purpose, so nothing loads the class.
 */
final class TypeOnlyProbe
{
    /**
     * @param  RepairOrder  $order
     */
    public function referenceOf(mixed $order): string
    {
        return (string) $order->reference;
    }
}
