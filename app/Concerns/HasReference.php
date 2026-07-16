<?php

namespace App\Concerns;

use App\Support\Reference;

/**
 * Assigns a unique human reference on create.
 *
 * Trait-usage coverage: used by BOTH Customer and RepairOrder, so
 * references-on-trait and definition-through-trait have two owners.
 */
trait HasReference
{
    public static function bootHasReference(): void
    {
        static::creating(function ($model): void {
            if (blank($model->reference)) {
                $model->reference = atelier_format_reference(
                    config('atelier.ref_prefix', ATELIER_REF_PREFIX),
                    Reference::next(static::class),
                );
            }
        });
    }

    /**
     * Needle for scope-through-trait queries: WHERE reference = ?
     */
    public function scopeWithReference($query, string $reference)
    {
        return $query->where('reference', $reference);
    }
}
