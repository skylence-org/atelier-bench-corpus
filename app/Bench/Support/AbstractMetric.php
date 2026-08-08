<?php

namespace App\Bench\Support;

use App\Bench\Contracts\MetricContract;

abstract class AbstractMetric extends AbstractComponent implements MetricContract
{
    public function name(): string
    {
        return 'metric';
    }

    public function label(): string
    {
        return ucfirst($this->name());
    }
}
