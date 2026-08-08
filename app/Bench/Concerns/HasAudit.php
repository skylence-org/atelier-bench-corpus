<?php

namespace App\Bench\Concerns;

trait HasAudit
{
    protected array $trail = [];
    public function record(string $event): void { $this->trail[] = $event; }
}
