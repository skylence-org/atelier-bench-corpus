<?php

namespace Tests\Feature;

use App\Enums\Priority;
use App\Enums\RepairStatus;
use App\Events\RepairCompleted;
use App\Models\Part;
use App\Models\RepairOrder;
use App\Models\User;
use App\Notifications\RushOrderOpened;
use App\Services\RushInvoiceCalculator;
use App\Services\StandardInvoiceCalculator;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Laravel\Pennant\Feature;
use Laravel\Sanctum\Sanctum;
use Livewire\Volt\Volt;
use Tests\TestCase;

/**
 * Integration wiring (wave E2): every first-party package exercised through
 * its real entry point (sanctum guard, scout database driver, pennant flag,
 * folio pages, volt component, broadcast channel, slack notification,
 * socialite redirect). Runs against the deterministic seed.
 */
class IntegrationsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Explicit seed: the $seed flag only applies when THIS class triggers
        // the one-time migrate:fresh, and earlier test classes migrate first.
        $this->seed();
    }

    public function test_sanctum_guards_the_note_creation_endpoint(): void
    {
        $reference = RepairOrder::query()->firstOrFail()->reference;

        $payload = ['body' => 'Sanctum-authenticated note.', 'author' => 'tester'];

        $this->postJson("/api/orders/{$reference}/notes", $payload)
            ->assertStatus(401);

        Sanctum::actingAs(User::query()->firstOrFail());

        $this->postJson("/api/orders/{$reference}/notes", $payload)
            ->assertStatus(201);
    }

    public function test_scout_database_driver_finds_the_seeded_part(): void
    {
        $skus = Part::search('screen')->get()->pluck('sku');

        $this->assertContains('SCR-13', $skus);
    }

    public function test_pennant_flag_gates_the_rush_surcharge(): void
    {
        $this->assertTrue(Feature::active('rush-surcharge'));

        $order = RepairOrder::query()->firstOrFail();
        $rush = new RushInvoiceCalculator(new StandardInvoiceCalculator);

        Feature::deactivate('rush-surcharge');

        $this->assertSame(
            (new StandardInvoiceCalculator)->calculate($order),
            $rush->calculate($order),
        );
    }

    public function test_folio_serves_the_about_and_order_pages(): void
    {
        $this->get('/about')->assertStatus(200);

        $order = RepairOrder::query()->firstOrFail();

        $this->get("/orders/{$order->reference}")
            ->assertStatus(200)
            ->assertSee($order->reference);
    }

    public function test_volt_renders_the_rush_counter_component(): void
    {
        Volt::test('rush-counter')->assertSee('Rush orders');
    }

    public function test_repair_completed_broadcasts_on_the_private_orders_channel(): void
    {
        $order = RepairOrder::query()->firstOrFail();

        $channels = (new RepairCompleted($order))->broadcastOn();

        $this->assertCount(1, $channels);
        $this->assertInstanceOf(PrivateChannel::class, $channels[0]);
        $this->assertSame('private-orders', (string) $channels[0]->name);
    }

    public function test_completing_a_rush_order_sends_the_slack_notification(): void
    {
        Notification::fake();

        config(['services.slack.notifications.bot_user_oauth_token' => 'xoxb-bench-test']);

        $seeded = RepairOrder::query()->firstOrFail();

        $order = RepairOrder::query()->create([
            'customer_id' => $seeded->customer_id,
            'device_id' => $seeded->device_id,
            'technician_id' => $seeded->technician_id,
            'priority' => Priority::Rush,
            'status' => RepairStatus::Repairing,
            'opened_at' => now(),
        ]);

        $this->assertTrue($order->complete('tester'));

        Notification::assertSentTo(User::query()->firstOrFail(), RushOrderOpened::class);
    }

    public function test_socialite_redirects_to_github(): void
    {
        $response = $this->get('/auth/github/redirect');

        $response->assertStatus(302);
        $this->assertStringContainsString('github.com', (string) $response->headers->get('Location'));
    }
}
