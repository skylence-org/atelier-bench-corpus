<?php

namespace App\Bench\Contracts;

interface MetricContract
{
    public function value(): float;
    public function label(): string;
}
