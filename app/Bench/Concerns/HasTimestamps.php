<?php

namespace App\Bench\Concerns;

trait HasTimestamps
{
    protected ?int $touchedAt = null;
    public function touchedAt(): int { return $this->touchedAt ??= time(); }
}
