<?php

namespace App\Bench\Contracts;

interface ScheduleContract
{
    public function frequency(): string;
}
