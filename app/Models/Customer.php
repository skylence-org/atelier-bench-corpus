<?php

namespace App\Models;

use App\Concerns\HasReference;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * @property string $reference
 * @property-read string $display_name
 */
class Customer extends Model
{
    use HasFactory;
    use HasReference;

    protected $guarded = [];

    public function devices(): HasMany
    {
        return $this->hasMany(Device::class);
    }

    public function repairOrders(): HasMany
    {
        return $this->hasMany(RepairOrder::class);
    }

    public function notes(): MorphMany
    {
        return $this->morphMany(Note::class, 'notable');
    }

    /**
     * New-style accessor: "Jane Doe (AT-2026-000001)".
     */
    protected function displayName(): Attribute
    {
        return Attribute::get(
            fn (): string => sprintf('%s (%s)', $this->name, $this->reference),
        );
    }
}
