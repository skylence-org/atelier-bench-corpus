<?php

namespace Tests\Feature;

use App\Enums\RepairStatus;
use App\Events\RepairCompleted;
use App\Models\RepairOrder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class RepairLifecycleTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_illegal_transition_is_refused_and_writes_no_log_row(): void
    {
        $order = RepairOrder::factory()->create();

        $this->assertFalse($order->transitionTo(RepairStatus::Completed, 'tester'));

        $this->assertSame(RepairStatus::Received, $order->refresh()->status);
        $this->assertDatabaseCount('status_logs', 0);
    }

    public function test_a_legal_transition_writes_a_log_row(): void
    {
        $order = RepairOrder::factory()->create();

        $this->assertTrue($order->transitionTo(RepairStatus::Diagnosing, 'tester'));

        $this->assertSame(RepairStatus::Diagnosing, $order->refresh()->status);
        $this->assertDatabaseHas('status_logs', [
            'repair_order_id' => $order->id,
            'from' => RepairStatus::Received->value,
            'to' => RepairStatus::Diagnosing->value,
            'changed_by' => 'tester',
        ]);
    }

    public function test_complete_stamps_completion_prices_the_order_and_fires_the_event(): void
    {
        Event::fake([RepairCompleted::class]);

        $order = RepairOrder::factory()->create(['status' => RepairStatus::Repairing]);

        $this->assertTrue($order->complete('tester'));

        $order->refresh();
        $this->assertSame(RepairStatus::Completed, $order->status);
        $this->assertNotNull($order->completed_at);

        // No parts attached: subtotal is exactly the flat labor rate.
        $this->assertSame(
            (int) config('atelier.labor_rate_cents'),
            (int) $order->getRawOriginal('subtotal_cents'),
        );

        Event::assertDispatched(
            RepairCompleted::class,
            fn (RepairCompleted $event) => $event->order->is($order),
        );
    }
}
