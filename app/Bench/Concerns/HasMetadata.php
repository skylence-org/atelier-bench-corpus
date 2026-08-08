<?php

namespace App\Bench\Concerns;

trait HasMetadata
{
    protected array $meta = [];
    public function withMeta(string $k, mixed $v): static { $this->meta[$k] = $v; return $this; }
}
