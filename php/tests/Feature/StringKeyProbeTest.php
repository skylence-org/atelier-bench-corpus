<?php

namespace Tests\Feature;

use App\Enums\RepairStatus;
use App\Models\RepairOrder;
use App\Models\User;
use App\Support\Edge\StringKeyProbe;
use App\Support\Edge\ClockAware;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StringKeyProbeTest extends TestCase
{
    use RefreshDatabase;

    public function test_string_keyed_container_binding_resolves_the_system_clock(): void
    {
        $this->assertInstanceOf(ClockAware::class, app('atelier.clock'));
        $this->assertSame(app('atelier.clock'), app('atelier.clock'));
        $this->assertGreaterThan(0, (new StringKeyProbe())->clockNow());
    }

    public function test_gate_ability_string_reaches_the_policy(): void
    {
        $user = User::factory()->create();
        $open = RepairOrder::factory()->create();
        $delivered = RepairOrder::factory()->create(['status' => RepairStatus::Delivered]);

        $probe = new StringKeyProbe();
        $this->assertTrue($probe->canUpdate($user, $open));
        $this->assertFalse($probe->canUpdate($user, $delivered));
    }

    public function test_config_key_reads_the_labor_rate(): void
    {
        $this->assertSame((int) config('atelier.labor_rate_cents'), (new StringKeyProbe())->laborRateCents());
    }
}
