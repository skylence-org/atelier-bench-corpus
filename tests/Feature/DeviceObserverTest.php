<?php

namespace Tests\Feature;

use App\Models\Device;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class DeviceObserverTest extends TestCase
{
    use RefreshDatabase;

    public function test_creating_a_device_logs_its_serial(): void
    {
        Log::spy();

        $device = Device::factory()->create();

        Log::shouldHaveReceived('info')
            ->withArgs(
                fn ($message, $context = []) => $message === 'Device created'
                    && ($context['serial'] ?? null) === $device->serial,
            )
            ->once();
    }
}
