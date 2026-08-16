<?php

namespace App\Bench\Contracts;

/**
 * Cardinality-surface contract: 48 trivial implementors under app/Bench/Rules/.
 */
interface RuleContract
{
    public function evaluate(array $rows): bool;
}
