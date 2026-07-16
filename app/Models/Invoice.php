<?php

namespace App\Models;

use App\Casts\Money;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

/**
 * HasOne inverse + HasOneThrough target (Device -> RepairOrder -> Invoice).
 *
 * @property string $total_cents money as decimal string via the Money cast
 */
class Invoice extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'total_cents' => Money::class,
            'issued_at' => 'datetime',
        ];
    }

    public function repairOrder(): BelongsTo
    {
        return $this->belongsTo(RepairOrder::class);
    }

    /**
     * MorphOne: an invoice carries one customer sign-off.
     */
    public function signature(): MorphOne
    {
        return $this->morphOne(Signature::class, 'signable');
    }
}
