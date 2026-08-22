<?php

namespace App\Support\Canonical\Wave2;

/**
 * PHP's trait-conflict resolution. Both traits declare rate(); insteadof picks
 * HasSurcharge's and `as` rebinds the excluded one under a second name.
 * Resolving rate() by bare name lands on the wrong trait half the time.
 */
final class PricingPolicy
{
    use HasSurcharge, HasDiscount {
        HasSurcharge::rate insteadof HasDiscount;
        HasDiscount::rate as discountRate;
    }

    public function net(int $cents): int
    {
        return (int) round($cents * (100 + $this->rate() - $this->discountRate()) / 100);
    }
}
