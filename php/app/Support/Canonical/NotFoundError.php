<?php

namespace App\Support\Canonical;

/**
 * Raised when a lookup by human reference misses.
 */
class NotFoundError extends AtelierError
{
    public function __construct(string $what, string $reference)
    {
        parent::__construct(sprintf('%s not found: %s', $what, $reference));
    }
}
