<?php

namespace App\Bench\Notifiers;

use App\Bench\Support\AbstractNotifier;
use App\Bench\Concerns\HasLogging;
use App\Bench\Exporters\CsvExporter;

class EmailNotifier extends AbstractNotifier
{
    use HasLogging;

    public function __construct(
        private readonly CsvExporter $csvExporter,
    ) {
    }

    public function name(): string
    {
        return 'emailnotifier';
    }

    public function notify(string $message): void
    {
        $payload = $this->csvExporter->export(['message' => $message]);
        $this->log('EmailNotifier: ' . $payload);
    }
}
