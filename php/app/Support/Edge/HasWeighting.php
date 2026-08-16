<?php

namespace App\Support\Edge;

/**
 * Breadth surface: trait with an abstract method + a static property, used
 * by two classes (LightItem, HeavyItem).
 */
trait HasWeighting
{
    protected static int $defaultWeight = 1;

    abstract public function weight(): int;

    public function weightedScore(int $base): int
    {
        return $base * $this->weight();
    }
}
