<?php

namespace App\Support\Canonical;

/**
 * The real declaration behind the Exports barrel.
 *
 * imp-barrel-no-fanout: consumers import App\Support\Canonical\Exports\Ledger,
 * which is only an alias registered by Exports/barrel.php. Resolution must land
 * HERE and must not fan out to the barrel file or to unrelated siblings.
 */
final class Ledger
{
    public function __construct(private readonly int $cents = 0) {}

    public function add(int $cents): self
    {
        return new self($this->cents + $cents);
    }

    public function totalCents(): int
    {
        return $this->cents;
    }
}
