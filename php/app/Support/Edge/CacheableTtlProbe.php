<?php

namespace App\Support\Edge;

use App\Bench\Reports\CashFlowReport;

/**
 * Breadth surface: interface constant referenced through an implementor.
 * CACHE_TTL is declared on CacheableContract, read here via CashFlowReport.
 */
final class CacheableTtlProbe
{
    public function ttlSeconds(): int
    {
        return CashFlowReport::CACHE_TTL;
    }
}
