<?php

namespace App\Events;

use App\Models\RepairOrder;
use Illuminate\Foundation\Events\Dispatchable;

/**
 * Fired by RepairOrder::complete(); consumed by SendCompletionNotice.
 * Promoted readonly property + event-dispatch reference coverage.
 */
class RepairCompleted
{
    use Dispatchable;

    public function __construct(
        public readonly RepairOrder $order,
    ) {}
}
