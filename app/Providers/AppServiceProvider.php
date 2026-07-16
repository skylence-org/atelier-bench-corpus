<?php

namespace App\Providers;

use App\Contracts\InvoiceCalculator;
use App\Events\RepairCompleted;
use App\Listeners\SendCompletionNotice;
use App\Models\RepairOrder;
use App\Models\User;
use App\Policies\RepairOrderPolicy;
use App\Services\StandardInvoiceCalculator;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Laravel\Pennant\Feature;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Interface-to-implementation binding: definition through the contract
     * must land on StandardInvoiceCalculator (Rush composes it explicitly).
     */
    public function register(): void
    {
        $this->app->bind(InvoiceCalculator::class, StandardInvoiceCalculator::class);
    }

    /**
     * Explicit event/policy/broadcast-auth/feature wiring (explicit beats
     * discovered: every edge exists in code rather than convention).
     */
    public function boot(): void
    {
        Event::listen(RepairCompleted::class, SendCompletionNotice::class);

        Gate::policy(RepairOrder::class, RepairOrderPolicy::class);

        // Pennant flag consumed by RushInvoiceCalculator: on for everyone by
        // default, per-user overridable through the features table.
        Feature::define('rush-surcharge', fn (?User $user = null): bool => true);

        // Private broadcast channel for RepairCompleted (Reverb-ready).
        Broadcast::channel('orders', fn (User $user): bool => true);
    }
}
