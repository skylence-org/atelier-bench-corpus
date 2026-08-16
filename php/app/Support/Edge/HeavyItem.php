<?php

namespace App\Support\Edge;

final class HeavyItem
{
    use HasWeighting;

    public function weight(): int
    {
        return 5;
    }
}
