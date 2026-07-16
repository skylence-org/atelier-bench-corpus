<?php

namespace App\Events;

use App\Models\RepairOrder;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

/**
 * Fired by RepairOrder::complete(); consumed by SendCompletionNotice AND
 * broadcast (Reverb-ready) on the private orders channel. Promoted readonly
 * property + event-dispatch + ShouldBroadcast contract coverage.
 */
class RepairCompleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;

    public function __construct(
        public readonly RepairOrder $order,
    ) {}

    /**
     * @return list<PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return [new PrivateChannel('orders')];
    }

    public function broadcastAs(): string
    {
        return 'repair.completed';
    }
}
