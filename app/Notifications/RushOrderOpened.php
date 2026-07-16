<?php

namespace App\Notifications;

use App\Models\RepairOrder;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Slack\SlackMessage;

/**
 * Slack-channel notification (laravel/slack-notification-channel): sent to
 * the admin User when a rush order completes. Guarded by SendCompletionNotice
 * so it only fires when a bot token is configured.
 */
class RushOrderOpened extends Notification
{
    public function __construct(
        public readonly RepairOrder $order,
    ) {}

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return ['slack'];
    }

    public function toSlack(object $notifiable): SlackMessage
    {
        return (new SlackMessage)
            ->text(sprintf('Rush order %s completed at %s', $this->order->reference, $this->order->completed_at?->toTimeString()));
    }
}
