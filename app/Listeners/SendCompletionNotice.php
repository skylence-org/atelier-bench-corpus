<?php

namespace App\Listeners;

use App\Events\RepairCompleted;
use Illuminate\Support\Facades\Log;

/**
 * Listener wired explicitly via Event::listen in AppServiceProvider::boot
 * (explicit registration is a references edge; auto-discovery is not).
 */
class SendCompletionNotice
{
    public function handle(RepairCompleted $event): void
    {
        Log::info('Repair completed', [
            'reference' => $event->order->reference,
            'total' => $event->order->subtotal_cents,
        ]);
    }
}
