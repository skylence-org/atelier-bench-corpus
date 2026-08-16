<?php

namespace App\Bench\Notifiers;

use App\Bench\Support\AbstractNotifier;
use App\Bench\Concerns\HasLogging;
use App\Bench\Exporters\XlsxExporter;

class DiscordNotifier extends AbstractNotifier
{
    use HasLogging;

    public function __construct(
        private readonly XlsxExporter $xlsxExporter,
    ) {
    }

    public function name(): string
    {
        return 'discordnotifier';
    }

    public function notify(string $message): void
    {
        $payload = $this->xlsxExporter->export(['message' => $message]);
        $this->log('DiscordNotifier: ' . $payload);
    }
}
