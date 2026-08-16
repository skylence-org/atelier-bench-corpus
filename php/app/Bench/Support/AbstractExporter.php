<?php

namespace App\Bench\Support;

use App\Bench\Contracts\ExporterContract;

abstract class AbstractExporter extends AbstractComponent implements ExporterContract
{
    public function name(): string
    {
        return 'exporter';
    }
}
