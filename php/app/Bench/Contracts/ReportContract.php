<?php

namespace App\Bench\Contracts;

interface ReportContract
{
    public function generate(): array;
    public function title(): string;
}
