<?php

namespace App\Support\Edge;

interface Clock
{
    public function now(): int;
}

final class SystemClock implements Clock
{
    public function now(): int
    {
        return time();
    }
}

/**
 * Breadth surface: `new` in a constructor default (initializer) plus a
 * `never` return type.
 */
final class ClockAware
{
    public function __construct(private Clock $clock = new SystemClock())
    {
    }

    public function currentTimestamp(): int
    {
        return $this->clock->now();
    }

    public function reject(string $reason): never
    {
        throw new \RuntimeException($reason);
    }
}

final class ClockAwareDemo
{
    public function timestamp(): int
    {
        return (new ClockAware())->currentTimestamp();
    }
}
