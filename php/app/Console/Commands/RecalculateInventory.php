<?php

namespace App\Console\Commands;

use App\Jobs\RecalculateInventory as RecalculateInventoryJob;
use Illuminate\Console\Command;
use Throwable;

/**
 * Same class name as App\Jobs\RecalculateInventory, different namespace. PHP
 * forbids importing the job under its own name in this file, because the import
 * would collide with the class declared below, so the import is aliased. Only
 * that alias separates the two names.
 */
class RecalculateInventory extends Command
{
    protected $signature = 'atelier:recalculate-inventory {--restock=10 : Target stock level}';

    protected $description = 'Rebuild part stock from consumed pivot quantities.';

    public function handle(): int
    {
        $counted = 0;

        RecalculateInventoryJob::withCallback(
            (int) $this->option('restock'),
            function (?Throwable $error, int $parts) use (&$counted): void {
                $counted = $error === null ? $parts : 0;
            },
        );

        $this->components->info("Recalculated stock for {$counted} parts.");

        return self::SUCCESS;
    }
}
