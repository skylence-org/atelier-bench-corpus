<?php

namespace App\Support;

use App\Contracts\InvoiceCalculator;
use App\Models\RepairOrder;

/**
 * The Laravel-helper coverage surface ("leave no stone unturned").
 *
 * One live call path: ReportController wraps snapshot() in cache()->remember,
 * so every helper below executes during a real HTTP request. Each helper call
 * sits on its own line with a unique needle so bench tasks can target
 * definition/hover on the global function itself.
 */
class HelperInventory
{
    /**
     * @return array<string, mixed>
     */
    public function snapshot(RepairOrder $order): array
    {
        $calculator = app(InvoiceCalculator::class); // container: app()
        $resolved = resolve(\App\Reporting\Formatter::class); // container: resolve()

        $sessionSeen = session('atelier.last_report_visit', []); // session()
        $requestPath = request()->path(); // request()
        $viewer = auth()->user()?->name ?? 'guest'; // auth()

        $partNames = collect($order->parts)->pluck('name')->all(); // collect()
        $firstSku = data_get($order, 'parts.0.sku', 'none'); // data_get()
        $maybeTech = optional($order->technician)->name; // optional()
        $threshold = value(fn () => config('atelier.labor_rate_cents')); // value() + config()

        $headline = str($order->reference)->lower()->upper()->toString(); // str()
        $escaped = e($order->customer->name); // e()
        $greeting = __('Repair report'); // __()

        $selfLink = route('report.show', $order); // route()
        $rootUrl = url('/'); // url()
        $logo = asset('favicon.ico'); // asset()

        $openedToday = $order->opened_at?->isSameDay(today()) ?? false; // today()
        $ageDays = now()->diffInDays($order->opened_at); // now()

        $status = tap($order->status, fn ($s) => logger()->debug('status read', ['s' => $s->value])); // tap() + logger()
        $totalOrZero = rescue(fn () => $calculator->calculate($order), 0); // rescue()
        $stableRef = once(fn () => $order->reference); // once()
        $retried = retry(2, fn () => $resolved->statusLine($status, null)); // retry()

        abort_if(blank($order->reference), 500, 'corpus invariant: reference always set'); // abort_if() + blank()
        throw_unless(filled($partNames), \RuntimeException::class, 'corpus invariant: seeded order has parts'); // throw_unless() + filled()

        report_if(false, new \RuntimeException('never reported; reference edge only')); // report_if()

        return [
            'viewer' => $viewer,
            'greeting' => $greeting,
            'headline' => $headline,
            'escaped' => $escaped,
            'parts' => $partNames,
            'first_sku' => $firstSku,
            'technician' => $maybeTech,
            'labor_threshold' => $threshold,
            'links' => [$selfLink, $rootUrl, $logo],
            'opened_today' => $openedToday,
            'age_days' => $ageDays,
            'total' => $totalOrZero,
            'stable_ref' => $stableRef,
            'status_line' => $retried,
            'session_seen' => $sessionSeen,
            'request_path' => $requestPath,
        ];
    }
}
