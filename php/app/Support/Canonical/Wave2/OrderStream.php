<?php

namespace App\Support\Canonical\Wave2;

use Generator;

/**
 * PHP's generator: each() suspends at every yield instead of building an array.
 * Same question as the typescript, python and go lanes' generator ids.
 */
final class OrderStream
{
    /** @param list<string> $references */
    public function __construct(private readonly array $references = []) {}

    /** @return Generator<int, string> */
    public function each(): Generator
    {
        foreach ($this->references as $index => $reference) {
            yield $index => strtoupper($reference);
        }
    }
}
