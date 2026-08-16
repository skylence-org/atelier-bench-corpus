<?php

namespace App\Policies;

use App\Models\RepairOrder;
use App\Models\User;

/**
 * Registered explicitly via Gate::policy in AppServiceProvider::boot.
 */
class RepairOrderPolicy
{
    public function update(User $user, RepairOrder $order): bool
    {
        return ! $order->status->isTerminal();
    }

    public function delete(User $user, RepairOrder $order): bool
    {
        return $order->statusLogs()->doesntExist();
    }
}
