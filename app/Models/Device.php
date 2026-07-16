<?php

namespace App\Models;

use App\Observers\DeviceObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

#[ObservedBy(DeviceObserver::class)]
class Device extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $guarded = [];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function repairOrders(): HasMany
    {
        return $this->hasMany(RepairOrder::class);
    }

    /**
     * HasOneThrough: the invoice reached through this device's repair order.
     */
    public function invoice(): HasOneThrough
    {
        return $this->hasOneThrough(Invoice::class, RepairOrder::class);
    }

    /**
     * MorphToMany: labels attached to this device.
     */
    public function labels(): MorphToMany
    {
        return $this->morphToMany(Label::class, 'labelable');
    }

    /**
     * "Fairphone 5 (SN-123)" line used by the report blade and the resource table.
     */
    public function label(): string
    {
        return sprintf('%s %s (%s)', $this->brand, $this->model, $this->serial);
    }
}
