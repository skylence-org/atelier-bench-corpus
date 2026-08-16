<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * Cents-in-DB, decimal-string-in-PHP money cast.
 *
 * Custom cast coverage: attribute reads on RepairOrder::$subtotal and
 * Part::$unit_price resolve through here rather than a column type.
 *
 * @implements CastsAttributes<string, int>
 */
class Money implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): string
    {
        $cents = (int) ($value ?? 0);

        return sprintf('%d.%02d', intdiv($cents, 100), abs($cents % 100));
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): int
    {
        if (is_int($value)) {
            return $value;
        }

        [$units, $fraction] = array_pad(explode('.', (string) $value, 2), 2, '0');

        return ((int) $units) * 100 + (int) str_pad(substr($fraction, 0, 2), 2, '0');
    }
}
