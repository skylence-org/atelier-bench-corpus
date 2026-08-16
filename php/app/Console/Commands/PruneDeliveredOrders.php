<?php

namespace App\Console\Commands;

use App\Jobs\RecalculateInventory;
use App\Models\RepairOrder;
use Illuminate\Console\Command;

/**
 * Artisan-command coverage + helper usage in console context:
 * config(), now(), collect(), str(), logger(), dispatch(), rescue().
 */
class PruneDeliveredOrders extends Command
{
    protected $signature = 'atelier:prune-delivered {--days=30 : Age threshold in days}';

    protected $description = 'Delete delivered repair orders older than the threshold, then rebuild inventory.';

    public function handle(): int
    {
        $threshold = now()->subDays((int) $this->option('days'));

        $pruned = collect(
            RepairOrder::query()
                ->where('status', \App\Enums\RepairStatus::Delivered->value)
                ->where('completed_at', '<', $threshold)
                ->get()
        )->each(fn (RepairOrder $order) => rescue(fn () => $order->delete()));

        logger()->info(str('pruned delivered orders')->headline()->toString(), [
            'count' => $pruned->count(),
            'prefix' => config('atelier.ref_prefix'),
        ]);

        dispatch(new RecalculateInventory);

        $this->components->info("Pruned {$pruned->count()} delivered orders.");

        return self::SUCCESS;
    }
}
