<?php

namespace App\Bench\Contracts;

interface ExporterContract
{
    public function export(array $rows): string;
}
