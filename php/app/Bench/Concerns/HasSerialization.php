<?php

namespace App\Bench\Concerns;

trait HasSerialization
{
    public function toArray(): array { return get_object_vars($this); }
}
