<?php

namespace App\Bench\Support;

use App\Bench\Contracts\ReportContract;

abstract class AbstractReport extends AbstractService implements ReportContract
{
    public function run(): array
    {
        return $this->generate();
    }

    public function title(): string
    {
        return ucfirst($this->name());
    }
}
