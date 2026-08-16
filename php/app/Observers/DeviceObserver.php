<?php

namespace App\Observers;

use App\Models\Device;

/**
 * Registered on Device via the #[ObservedBy] model attribute.
 */
class DeviceObserver
{
    public function created(Device $device): void
    {
        logger()->info('Device created', ['serial' => $device->serial]);
    }
}
