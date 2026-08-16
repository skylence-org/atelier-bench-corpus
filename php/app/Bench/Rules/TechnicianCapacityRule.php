<?php

namespace App\Bench\Rules;

use App\Bench\Contracts\RuleContract;

/**
 * Bench rule #5/48: trivial evaluator over seeded rows.
 */
final class TechnicianCapacityRule implements RuleContract
{
    public function evaluate(array $rows): bool
    {
        return count($rows) >= 1;
    }
}
