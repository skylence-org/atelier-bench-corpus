<?php

namespace App\Bench\Concerns;

trait HasCache
{
    protected array $store = [];
    public function remember(string $key, callable $cb): mixed { return $this->store[$key] ??= $cb(); }
}
