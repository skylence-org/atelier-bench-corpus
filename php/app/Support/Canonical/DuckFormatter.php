<?php

namespace App\Support\Canonical;

/**
 * Structural (duck-typed) satisfier of App\Bench\Contracts\FormatterContract:
 * the shape matches format(mixed): string, but the class never writes
 * `implements`, so a nominal implementor list must NOT contain it.
 */
final class DuckFormatter
{
    public function format(mixed $value): string
    {
        return is_scalar($value) ? (string) $value : gettype($value);
    }
}
