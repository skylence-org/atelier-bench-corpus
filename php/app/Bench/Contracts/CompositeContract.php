<?php

namespace App\Bench\Contracts;

/**
 * Multi-parent surface: three parent interfaces in one declaration.
 */
interface CompositeContract extends ReportContract, CacheableContract, ScheduleContract
{
}
