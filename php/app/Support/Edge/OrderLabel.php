<?php

namespace App\Support\Edge;

use App\Models\RepairOrder;

/**
 * Breadth surface: nullsafe chain resolving through two hops to a model
 * method.
 */
final class OrderLabel
{
    public function labelFor(?RepairOrder $order): ?string
    {
        return $order?->device?->label();
    }
}
