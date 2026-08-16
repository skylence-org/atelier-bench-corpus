<?php

namespace App\Support;

/**
 * Reference-number bookkeeping.
 *
 * Class-const definition target: PREFIX_SEPARATOR is read from the global
 * helper, the HasReference trait, and the seeder (three distinct namespaces).
 */
class Reference
{
    public const PREFIX_SEPARATOR = '-';

    /** Highest reference number handed out per prefix, in-memory only. */
    private static array $counters = [];

    public static function next(string $prefix): int
    {
        $current = self::$counters[$prefix] ?? 0;

        return self::$counters[$prefix] = $current + 1;
    }

    public static function reset(): void
    {
        self::$counters = [];
    }
}
