<?php

namespace App\Support\Canonical\Wave2;

/**
 * The other half of the trait-conflict pair: same method name, different value.
 * PricingPolicy excludes this one from rate() and rebinds it as discountRate().
 */
trait HasDiscount
{
    public function rate(): int
    {
        return 5;
    }
}
