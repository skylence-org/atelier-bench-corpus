<?php

namespace App\Support\Edge;

use Countable;
use Traversable;

/**
 * Breadth surface: intersection type parameter.
 */
final class Tally
{
    public function sizeOf(Countable&Traversable $items): int
    {
        return count($items);
    }

    public function measure(array $rows): int
    {
        return $this->sizeOf(new \ArrayIterator($rows));
    }
}
