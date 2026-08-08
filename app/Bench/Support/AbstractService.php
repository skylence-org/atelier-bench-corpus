<?php

namespace App\Bench\Support;

abstract class AbstractService extends AbstractComponent
{
    public function name(): string
    {
        return 'service';
    }

    abstract public function run(): array;
}
