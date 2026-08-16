<?php

namespace App\Bench\Rules;

use App\Bench\Contracts\RuleContract;

/**
 * Bench rule #3/48: trivial evaluator over seeded rows.
 */
final class WarrantyWindowRule implements RuleContract
{
    public function evaluate(array $rows): bool
    {
        return count($rows) >= 1;
    }
}
