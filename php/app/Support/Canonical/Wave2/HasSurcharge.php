<?php

namespace App\Support\Canonical\Wave2;

/**
 * One half of the trait-conflict pair: declares rate() with the same name as
 * HasDiscount::rate(). PricingPolicy resolves the collision with insteadof.
 */
trait HasSurcharge
{
    public function rate(): int
    {
        return 15;
    }
}
