<?php

namespace App\Enums;

/**
 * Order priority. weight() feeds RushInvoiceCalculator's surcharge and the
 * table sort; fromWeight() is a static-constructor definition target.
 */
enum Priority: string
{
    case Low = 'low';
    case Normal = 'normal';
    case Rush = 'rush';

    public function weight(): int
    {
        return match ($this) {
            self::Low => 0,
            self::Normal => 1,
            self::Rush => 2,
        };
    }

    public static function fromWeight(int $weight): self
    {
        return match (true) {
            $weight >= 2 => self::Rush,
            $weight === 1 => self::Normal,
            default => self::Low,
        };
    }
}
