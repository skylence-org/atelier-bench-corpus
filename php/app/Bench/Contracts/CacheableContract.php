<?php

namespace App\Bench\Contracts;

interface CacheableContract
{
    public const int CACHE_TTL = 3600;

    public function cacheKey(): string;
    public function ttl(): int;
}
