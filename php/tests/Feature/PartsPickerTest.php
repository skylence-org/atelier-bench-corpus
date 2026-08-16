<?php

namespace Tests\Feature;

use App\Livewire\PartsPicker;
use App\Models\Part;
use App\Models\RepairOrder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class PartsPickerTest extends TestCase
{
    use RefreshDatabase;

    public function test_attach_rejects_a_zero_quantity(): void
    {
        $order = RepairOrder::factory()->create();
        $part = Part::factory()->create();

        Livewire::test(PartsPicker::class, ['order' => $order])
            ->set('partId', $part->id)
            ->set('quantity', 0)
            ->call('attach')
            ->assertHasErrors(['quantity' => 'min']);

        $this->assertDatabaseCount('part_repair_order', 0);
    }

    public function test_attach_stores_the_pivot_row_and_dispatches_part_added(): void
    {
        $order = RepairOrder::factory()->create();
        $part = Part::factory()->create(['unit_price_cents' => 1500]);

        Livewire::test(PartsPicker::class, ['order' => $order])
            ->set('partId', $part->id)
            ->set('quantity', 2)
            ->call('attach')
            ->assertHasNoErrors()
            ->assertDispatched('part-added', orderId: $order->id);

        $this->assertDatabaseHas('part_repair_order', [
            'repair_order_id' => $order->id,
            'part_id' => $part->id,
            'quantity' => 2,
            'unit_price_cents' => 1500,
        ]);
    }
}
