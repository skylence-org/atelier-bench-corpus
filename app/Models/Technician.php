<?php

namespace App\Models;

use App\Concerns\ForwardsToSchedule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Carries the magic-forwarding trait: $technician->nextSlot(...) and
 * ->bookSlot(...) resolve through __call to App\Support\Schedule.
 *
 * @method \Carbon\CarbonImmutable nextSlot(\Carbon\CarbonImmutable $after)
 * @method bool bookSlot(\Carbon\CarbonImmutable $slot)
 */
class Technician extends Model
{
    use ForwardsToSchedule;
    use HasFactory;

    protected $guarded = [];

    public function repairOrders(): HasMany
    {
        return $this->hasMany(RepairOrder::class);
    }
}
