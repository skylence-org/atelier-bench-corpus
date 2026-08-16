<?php

namespace App\Support\Edge;

/**
 * Breadth surface: first-class callable syntax, both a global function and a
 * method reference, stored and invoked later.
 */
final class CallableStore
{
    /** @var array<int, callable> */
    private array $handlers = [];

    public function register(): void
    {
        $this->handlers[] = strlen(...);
        $this->handlers[] = $this->double(...);
    }

    public function double(int $value): int
    {
        return $value * 2;
    }

    public function invokeDouble(int $value): int
    {
        return ($this->handlers[1])($value);
    }
}
