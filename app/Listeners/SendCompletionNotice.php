<?php

namespace App\Listeners;

use App\Enums\Priority;
use App\Events\RepairCompleted;
use App\Models\User;
use App\Notifications\RushOrderOpened;
use Illuminate\Support\Facades\Log;

/**
 * Listener wired explicitly via Event::listen in AppServiceProvider::boot
 * (explicit registration is a references edge; auto-discovery is not).
 * Rush completions additionally notify the admin over Slack, guarded so a
 * credential-less environment (tests, fresh runners) never makes HTTP calls.
 */
class SendCompletionNotice
{
    public function handle(RepairCompleted $event): void
    {
        Log::info('Repair completed', [
            'reference' => $event->order->reference,
            'total' => $event->order->subtotal_cents,
        ]);

        $slackConfigured = filled(config('services.slack.notifications.bot_user_oauth_token'));

        if ($event->order->priority === Priority::Rush && $slackConfigured) {
            User::query()->first()?->notify(new RushOrderOpened($event->order));
        }
    }
}
