<?php

namespace App\Bench\Notifiers;

use App\Bench\Support\AbstractNotifier;
use App\Bench\Concerns\HasLogging;
use App\Bench\Exporters\JsonExporter;

class SmsNotifier extends AbstractNotifier
{
    use HasLogging;

    public function __construct(
        private readonly JsonExporter $jsonExporter,
    ) {
    }

    public function name(): string
    {
        return 'smsnotifier';
    }

    public function notify(string $message): void
    {
        $payload = $this->jsonExporter->export(['message' => $message]);
        $this->log('SmsNotifier: ' . $payload);
    }
}
