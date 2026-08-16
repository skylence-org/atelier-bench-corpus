<?php

namespace App\Support\Edge;

final class LightItem
{
    use HasWeighting;

    public function weight(): int
    {
        return 1;
    }
}
