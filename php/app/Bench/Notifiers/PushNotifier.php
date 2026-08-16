<?php

namespace App\Bench\Notifiers;

use App\Bench\Support\AbstractNotifier;
use App\Bench\Concerns\HasLogging;
use App\Bench\Exporters\HtmlExporter;

class PushNotifier extends AbstractNotifier
{
    use HasLogging;

    public function __construct(
        private readonly HtmlExporter $htmlExporter,
    ) {
    }

    public function name(): string
    {
        return 'pushnotifier';
    }

    public function notify(string $message): void
    {
        $payload = $this->htmlExporter->export(['message' => $message]);
        $this->log('PushNotifier: ' . $payload);
    }
}
