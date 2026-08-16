<?php

namespace Tests\Feature;

use App\Enums\RepairStatus;
use App\Livewire\StatusBoard;
use App\Models\RepairOrder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class StatusBoardTest extends TestCase
{
    use RefreshDatabase;

    public function test_status_filter_narrows_the_board_to_matching_orders(): void
    {
        $received = RepairOrder::factory()->create();
        $repairing = RepairOrder::factory()->create(['status' => RepairStatus::Repairing]);

        Livewire::test(StatusBoard::class)
            ->assertSee($received->reference)
            ->assertSee($repairing->reference)
            ->set('statusFilter', RepairStatus::Repairing->value)
            ->assertSee($repairing->reference)
            ->assertDontSee($received->reference);
    }

    public function test_complete_order_completes_a_repairing_order_and_dispatches_the_event(): void
    {
        $order = RepairOrder::factory()->create(['status' => RepairStatus::Repairing]);

        Livewire::test(StatusBoard::class)
            ->call('completeOrder', $order->id)
            ->assertDispatched('order-completed', orderId: $order->id);

        $order->refresh();
        $this->assertSame(RepairStatus::Completed, $order->status);
        $this->assertNotNull($order->completed_at);
    }
}
