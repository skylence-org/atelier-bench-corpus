<?php

namespace App\Support\Edge;

/**
 * Breadth surface: static closure plus a `match` with no default arm.
 */
final class PriorityMatcher
{
    public function resolver(): \Closure
    {
        return static function (string $level): int {
            return match ($level) {
                'low' => 1,
                'medium' => 2,
                'high' => 3,
            };
        };
    }

    public function score(string $level): int
    {
        return ($this->resolver())($level);
    }
}
