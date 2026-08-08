<?php

namespace App\Bench\Notifiers;

use App\Bench\Support\AbstractNotifier;
use App\Bench\Concerns\HasLogging;
use App\Bench\Exporters\XmlExporter;

class SlackNotifier extends AbstractNotifier
{
    use HasLogging;

    public function __construct(
        private readonly XmlExporter $xmlExporter,
    ) {
    }

    public function name(): string
    {
        return 'slacknotifier';
    }

    public function notify(string $message): void
    {
        $payload = $this->xmlExporter->export(['message' => $message]);
        $this->log('SlackNotifier: ' . $payload);
    }
}
