<?php

namespace App\Bench\Notifiers;

use App\Bench\Support\AbstractNotifier;
use App\Bench\Concerns\HasLogging;
use App\Bench\Exporters\YamlExporter;

class PagerNotifier extends AbstractNotifier
{
    use HasLogging;

    public function __construct(
        private readonly YamlExporter $yamlExporter,
    ) {
    }

    public function name(): string
    {
        return 'pagernotifier';
    }

    public function notify(string $message): void
    {
        $payload = $this->yamlExporter->export(['message' => $message]);
        $this->log('PagerNotifier: ' . $payload);
    }
}
