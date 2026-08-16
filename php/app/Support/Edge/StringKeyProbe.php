<?php

namespace App\Support\Edge;

use App\Models\RepairOrder;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

/**
 * Framework-magic surface: every edge below is keyed by a STRING that only
 * Laravel resolves at runtime (container key, gate ability, config key).
 */
final class StringKeyProbe
{
    public function clockNow(): int
    {
        return app('atelier.clock')->currentTimestamp();
    }

    public function canUpdate(User $user, RepairOrder $order): bool
    {
        return Gate::forUser($user)->allows('update', $order);
    }

    public function laborRateCents(): int
    {
        return (int) config('atelier.labor_rate_cents', 0);
    }
}
