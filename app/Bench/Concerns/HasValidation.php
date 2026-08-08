<?php

namespace App\Bench\Concerns;

trait HasValidation
{
    public function assertPositive(float $n): float { return $n < 0 ? 0.0 : $n; }
}
