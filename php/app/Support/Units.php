<?php

namespace App\Support;

/**
 * Import-precision surface: a namespaced const and function pair, each
 * consumed by exactly one of two sibling classes (see Formatting/).
 */
const ATELIER_UNIT_SUFFIX = 'u';

function atelier_format_unit(int $value): string
{
    return $value . ATELIER_UNIT_SUFFIX;
}
