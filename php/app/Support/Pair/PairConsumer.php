<?php

namespace App\Support\Pair;

use App\Support\Pair\Left;

/**
 * Imports only Left from the Left/Right sibling pair, never Right.
 */
final class PairConsumer
{
    public function __construct(private readonly Left $left)
    {
    }

    public function describe(): string
    {
        return $this->left->value();
    }
}
