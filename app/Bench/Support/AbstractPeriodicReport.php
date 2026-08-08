<?php

namespace App\Bench\Support;

use App\Bench\Contracts\ScheduleContract;

abstract class AbstractPeriodicReport extends AbstractReport implements ScheduleContract
{
    public function frequency(): string
    {
        return 'daily';
    }

    public function name(): string
    {
        return 'periodic';
    }
}
