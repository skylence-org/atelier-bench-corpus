<?php

namespace App\Providers;

use App\Contracts\InvoiceCalculator;
use App\Events\RepairCompleted;
use App\Listeners\SendCompletionNotice;
use App\Models\RepairOrder;
use App\Policies\RepairOrderPolicy;
use App\Services\StandardInvoiceCalculator;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

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
     * Explicit event and policy wiring (explicit > discovered, so the edges
     * exist in code rather than convention).
     */
    public function boot(): void
    {
        Event::listen(RepairCompleted::class, SendCompletionNotice::class);

        Gate::policy(RepairOrder::class, RepairOrderPolicy::class);
    }
}
