<?php

namespace App\Bench\Contracts;

interface CacheableContract
{
    public function cacheKey(): string;
    public function ttl(): int;
}
