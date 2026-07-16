<?php

namespace App\Filament\Widgets;

use App\Models\Part;
use App\Models\RepairOrder;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

/**
 * Widget coverage; also the second known caller of both Eloquent scopes and
 * of Part::consumedQuantity() (RecalculateInventory is the first).
 */
class RepairStats extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $consumed = Part::query()
            ->get()
            ->sum(fn (Part $part): int => $part->consumedQuantity());

        return [
            Stat::make('Open orders', (string) RepairOrder::query()->open()->count()),
            Stat::make('Rush orders', (string) RepairOrder::query()->rush()->count()),
            Stat::make('Parts consumed', (string) $consumed),
        ];
    }
}
