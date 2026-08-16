<?php

namespace App\Bench\Support;

abstract class AbstractComponent
{
    abstract public function name(): string;

    public function describe(): string
    {
        return static::class . ':' . $this->name();
    }
}
