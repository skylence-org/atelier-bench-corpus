<?php

namespace App\Bench\Concerns;

trait HasFormatting
{
    public function currency(float $n): string { return '$' . number_format($n, 2); }
    public function percent(float $n): string { return number_format($n * 100, 1) . '%'; }
}
