<?php

namespace App\Support\Edge;

/**
 * Breadth surface: readonly class with readonly-promoted constructor
 * properties (PHP 8.3).
 */
readonly class ImmutablePoint
{
    public function __construct(
        public float $x,
        public float $y,
    ) {
    }

    public function translated(float $dx, float $dy): self
    {
        return new self($this->x + $dx, $this->y + $dy);
    }
}
