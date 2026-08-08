<?php

namespace App\Bench\Exporters;

use App\Bench\Support\AbstractExporter;
use App\Bench\Concerns\HasSerialization;

class PdfExporter extends AbstractExporter
{
    use HasSerialization;

    public function name(): string
    {
        return 'pdfexporter';
    }

    public function export(array $rows): string
    {
        $out = [];
        foreach ($rows as $key => $value) {
            $out[] = $key . '=' . (is_scalar($value) ? $value : json_encode($value));
        }

        return implode("\n", $out);
    }
}
