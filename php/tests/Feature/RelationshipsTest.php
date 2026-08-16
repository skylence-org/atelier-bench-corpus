<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Device;
use App\Models\Invoice;
use App\Models\Label;
use App\Models\Note;
use App\Models\RepairOrder;
use App\Models\Signature;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Full Eloquent relationship matrix, asserted over the deterministic seed.
 */
class RelationshipsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_customer_status_logs_is_a_has_many_through_with_the_seeded_transitions(): void
    {
        $customer = Customer::query()->firstOrFail();

        $this->assertInstanceOf(HasManyThrough::class, $customer->statusLogs());
        $this->assertCount(3, $customer->statusLogs);
    }

    public function test_customer_latest_repair_order_is_the_seeded_order(): void
    {
        $customer = Customer::query()->firstOrFail();
        $order = RepairOrder::query()->firstOrFail();

        $this->assertInstanceOf(HasOne::class, $customer->latestRepairOrder());
        $this->assertTrue($customer->latestRepairOrder->is($order));
    }

    public function test_device_invoice_is_a_has_one_through_to_the_seeded_invoice(): void
    {
        $device = Device::query()->firstOrFail();

        $this->assertInstanceOf(HasOneThrough::class, $device->invoice());
        $this->assertSame('INV-2026-0001', $device->invoice->number);
    }

    public function test_order_invoice_is_a_has_one_with_a_belongs_to_inverse(): void
    {
        $order = RepairOrder::query()->firstOrFail();

        $this->assertInstanceOf(HasOne::class, $order->invoice());
        $this->assertTrue($order->invoice->is(Invoice::query()->firstOrFail()));
        $this->assertTrue($order->invoice->repairOrder->is($order));
    }

    public function test_order_signature_is_a_morph_one_signed_by_ada(): void
    {
        $order = RepairOrder::query()->firstOrFail();

        $this->assertInstanceOf(MorphOne::class, $order->signature());
        $this->assertSame('ada', $order->signature->signed_by);
        $this->assertTrue($order->signature->signable->is($order));
    }

    public function test_seeded_invoice_has_no_signature_until_one_is_morphed_on(): void
    {
        $invoice = Invoice::query()->firstOrFail();

        $this->assertNull($invoice->signature);

        $signature = Signature::factory()->for($invoice, 'signable')->create();

        $this->assertTrue($invoice->refresh()->signature->is($signature));
        $this->assertTrue($signature->signable->is($invoice));
    }

    public function test_order_latest_note_is_a_morph_one_of_many_returning_the_newest_note(): void
    {
        $order = RepairOrder::query()->firstOrFail();

        $this->assertInstanceOf(MorphOne::class, $order->latestNote());

        $newest = $order->notes()->create([
            'body' => 'Screen replaced, pending QA.',
            'author' => 'bench',
        ]);

        $this->assertInstanceOf(Note::class, $order->latestNote);
        $this->assertTrue($order->latestNote->is($newest));
    }

    public function test_order_labels_is_a_morph_to_many_containing_fragile(): void
    {
        $order = RepairOrder::query()->firstOrFail();

        $this->assertInstanceOf(MorphToMany::class, $order->labels());
        $this->assertTrue($order->labels->contains('name', 'fragile'));
    }

    public function test_fragile_label_is_morphed_by_many_orders_and_devices(): void
    {
        $order = RepairOrder::query()->firstOrFail();
        $device = Device::query()->firstOrFail();
        $label = Label::query()->where('name', 'fragile')->firstOrFail();

        $this->assertInstanceOf(MorphToMany::class, $label->repairOrders());
        $this->assertInstanceOf(MorphToMany::class, $label->devices());
        $this->assertTrue($label->repairOrders->contains($order));
        $this->assertTrue($label->devices->contains($device));
    }

    public function test_order_parts_pivot_still_carries_the_seeded_quantity(): void
    {
        $order = RepairOrder::query()->firstOrFail();

        $part = $order->parts()->firstOrFail();

        $this->assertSame(1, (int) $part->pivot->quantity);
    }
}
