<?php

namespace App\Http\Controllers;

use App\Billing\Formatter as BillingFormatter;
use App\Models\RepairOrder;
use App\Reporting\Formatter as ReportingFormatter;
use App\Support\HelperInventory;
use Illuminate\Contracts\View\View;

/**
 * The alias-resolution showcase: BOTH Formatter classes imported under
 * aliases (acuity #250 shadow class). Each alias must resolve to its own
 * namespace; a bare-name matcher conflates them. Also the live call path
 * for the HelperInventory coverage surface, wrapped in cache()->remember.
 */
class ReportController extends Controller
{
    public function __construct(
        private readonly BillingFormatter $money,
        private readonly ReportingFormatter $status,
    ) {}

    /**
     * Route-model-bound: GET /report/{repairOrder:reference}.
     */
    public function show(RepairOrder $repairOrder): View
    {
        abort_unless(filled($repairOrder->reference), 404);

        $order = $repairOrder->load(['customer', 'device', 'parts']);

        $helperSnapshot = cache()->remember(
            "report.{$order->reference}.helpers",
            now()->addMinutes(5),
            fn (): array => app(HelperInventory::class)->snapshot($order),
        );

        return view('report.summary', [
            'order' => $order,
            'moneyLine' => $this->money->money($order->subtotal_cents),
            'statusLine' => $this->status->statusLine(
                $order->status,
                $order->opened_at?->toDateString(),
            ),
            'helperSnapshot' => $helperSnapshot,
        ]);
    }
}
