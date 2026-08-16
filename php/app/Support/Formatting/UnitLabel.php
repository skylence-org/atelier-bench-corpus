<?php

namespace App\Support\Formatting;

use const App\Support\ATELIER_UNIT_SUFFIX;

/**
 * Imports only the const from App\Support\Units, never the function.
 */
final class UnitLabel
{
    public static function suffix(): string
    {
        return ATELIER_UNIT_SUFFIX;
    }
}
