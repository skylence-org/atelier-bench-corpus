<?php

namespace App\Bench\Rules;

use App\Bench\Contracts\RuleContract;

/**
 * Bench rule #9/48: trivial evaluator over seeded rows.
 */
final class DeviceAgeRule implements RuleContract
{
    public function evaluate(array $rows): bool
    {
        return count($rows) >= 1;
    }
}
