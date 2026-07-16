<?php

namespace Tests\Feature;

use App\Models\Part;
use App\Models\RepairOrder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_report_page_shows_the_order_reference_and_bench_header(): void
    {
        $order = RepairOrder::factory()->create();
        $part = Part::factory()->create();

        // HelperInventory::snapshot enforces a corpus invariant: orders have parts.
        $order->parts()->attach($part->id, [
            'quantity' => 1,
            'unit_price_cents' => $part->getRawOriginal('unit_price_cents'),
        ]);

        $response = $this->get("/report/{$order->reference}");

        $response->assertOk();
        $response->assertSee($order->reference);
        $response->assertHeader('X-Atelier-Bench', 'corpus');
    }
}
