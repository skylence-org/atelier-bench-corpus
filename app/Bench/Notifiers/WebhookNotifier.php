<?php

namespace App\Bench\Notifiers;

use App\Bench\Support\AbstractNotifier;
use App\Bench\Concerns\HasLogging;
use App\Bench\Exporters\PdfExporter;

class WebhookNotifier extends AbstractNotifier
{
    use HasLogging;

    public function __construct(
        private readonly PdfExporter $pdfExporter,
    ) {
    }

    public function name(): string
    {
        return 'webhooknotifier';
    }

    public function notify(string $message): void
    {
        $payload = $this->pdfExporter->export(['message' => $message]);
        $this->log('WebhookNotifier: ' . $payload);
    }
}
