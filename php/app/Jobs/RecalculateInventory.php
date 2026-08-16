<?php

namespace App\Jobs;

use App\Models\Part;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

/**
 * Rebuilds Part::$stock from consumed pivot quantities.
 * Queued-job coverage; also a second caller of Part::consumedQuantity().
 */
class RecalculateInventory implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly int $restockLevel = 10,
    ) {}

    public function handle(): void
    {
        Part::query()->each(function (Part $part): void {
            $consumed = $part->consumedQuantity();

            $part->forceFill([
                'stock' => max($this->restockLevel - $consumed, 0),
            ])->save();
        });
    }
}
