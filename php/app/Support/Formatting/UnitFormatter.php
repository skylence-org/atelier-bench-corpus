<?php

namespace App\Support\Formatting;

use function App\Support\atelier_format_unit;

/**
 * Imports only the function from App\Support\Units, never the const.
 */
final class UnitFormatter
{
    public static function format(int $value): string
    {
        return atelier_format_unit($value);
    }
}
