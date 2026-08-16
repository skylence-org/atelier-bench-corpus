<?php

namespace App\Bench\Notifiers;

use App\Bench\Support\AbstractNotifier;
use App\Bench\Concerns\HasLogging;
use App\Bench\Exporters\MarkdownExporter;

class TeamsNotifier extends AbstractNotifier
{
    use HasLogging;

    public function __construct(
        private readonly MarkdownExporter $markdownExporter,
    ) {
    }

    public function name(): string
    {
        return 'teamsnotifier';
    }

    public function notify(string $message): void
    {
        $payload = $this->markdownExporter->export(['message' => $message]);
        $this->log('TeamsNotifier: ' . $payload);
    }
}
