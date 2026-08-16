<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

/**
 * First-party polymorphic many-to-many: MorphedByMany from this side,
 * MorphToMany from RepairOrder/Device. (The vendor variant of the same
 * shape lives in spatie/laravel-tags on Part.)
 */
class Label extends Model
{
    use HasFactory;

    protected $guarded = [];

    /**
     * MorphedByMany: every repair order carrying this label.
     */
    public function repairOrders(): MorphToMany
    {
        return $this->morphedByMany(RepairOrder::class, 'labelable');
    }

    /**
     * MorphedByMany: every device carrying this label.
     */
    public function devices(): MorphToMany
    {
        return $this->morphedByMany(Device::class, 'labelable');
    }
}
