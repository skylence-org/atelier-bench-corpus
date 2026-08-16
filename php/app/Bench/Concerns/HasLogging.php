<?php

namespace App\Bench\Concerns;

trait HasLogging
{
    protected array $lines = [];
    public function log(string $line): void { $this->lines[] = $line; }
}
