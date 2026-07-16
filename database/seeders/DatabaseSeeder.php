<?php

namespace Database\Seeders;

use App\Enums\Priority;
use App\Enums\RepairStatus;
use App\Models\Customer;
use App\Models\Device;
use App\Models\Part;
use App\Models\RepairOrder;
use App\Models\Technician;
use App\Models\User;
use App\Support\Reference;
use Illuminate\Database\Seeder;

/**
 * Deterministic seed: fixed rows, no faker randomness, so benchmark queries
 * against seeded data have stable answers.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Reference::reset();

        User::query()->create([
            'name' => 'Bench Admin',
            'email' => 'admin@example.test',
            'password' => 'password',
        ]);

        $customer = Customer::query()->create([
            'name' => 'Ada Lovelace',
            'email' => 'ada@example.test',
            'phone' => '+32 470 00 00 01',
        ]);

        $device = Device::query()->create([
            'customer_id' => $customer->id,
            'kind' => 'laptop',
            'brand' => 'Framework',
            'model' => '13',
            'serial' => 'FW13-0001',
        ]);

        $technician = Technician::query()->create([
            'name' => 'Grace Hopper',
            'email' => 'grace@example.test',
            'specialty' => 'mainboards',
            'hourly_rate_cents' => 9500,
        ]);

        $screen = Part::query()->create([
            'sku' => 'SCR-13',
            'name' => 'Replacement screen',
            'unit_price_cents' => 12900,
            'stock' => 4,
        ]);

        $order = RepairOrder::query()->create([
            'customer_id' => $customer->id,
            'device_id' => $device->id,
            'technician_id' => $technician->id,
            'priority' => Priority::Rush,
            'opened_at' => now()->subDay(),
        ]);

        $order->parts()->attach($screen->id, [
            'quantity' => 1,
            'unit_price_cents' => $screen->getRawOriginal('unit_price_cents'),
        ]);

        $order->notes()->create([
            'body' => 'Cracked screen, hinge intact.',
            'author' => 'intake',
        ]);

        // Drive the full lifecycle so status_logs has deterministic rows and
        // complete() has a seeder call site.
        $order->transitionTo(RepairStatus::Diagnosing, 'seeder');
        $order->transitionTo(RepairStatus::Repairing, 'seeder');
        $order->complete('seeder');
    }
}
