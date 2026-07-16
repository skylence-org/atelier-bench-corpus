<?php

namespace App\Models;

use App\Casts\Money;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Scout\Searchable;
use Spatie\Tags\HasTags;

/**
 * @property string $unit_price money as decimal string via the Money cast
 */
class Part extends Model
{
    use HasFactory, HasTags, Searchable;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'unit_price_cents' => Money::class,
        ];
    }

    /**
     * Scout (database driver): searchable surface is sku + name.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return [
            'sku' => $this->sku,
            'name' => $this->name,
        ];
    }

    public function repairOrders(): BelongsToMany
    {
        return $this->belongsToMany(RepairOrder::class)
            ->withPivot(['quantity', 'unit_price_cents'])
            ->withTimestamps();
    }

    /**
     * Total quantity consumed across all orders (pivot aggregate).
     * Two known callers: RecalculateInventory and the stats widget.
     */
    public function consumedQuantity(): int
    {
        return (int) $this->repairOrders()->sum('part_repair_order.quantity');
    }
}
