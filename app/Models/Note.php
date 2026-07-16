<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * Polymorphic note: notable() resolves to Customer or RepairOrder.
 */
class Note extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function notable(): MorphTo
    {
        return $this->morphTo();
    }
}
