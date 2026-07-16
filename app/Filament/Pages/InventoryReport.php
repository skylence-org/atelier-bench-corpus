<?php

namespace App\Filament\Pages;

use App\Models\Part;
use Filament\Pages\Page;
use Illuminate\Support\Collection;
use Livewire\Attributes\Computed;

/**
 * Livewire computed-property coverage (acuity #241 class): the blade reads
 * $this->lowStockParts, which resolves through the #[Computed] attribute,
 * not a real property. A bare-name matcher sees nothing to resolve.
 */
class InventoryReport extends Page
{
    protected string $view = 'filament.pages.inventory-report';

    /** Parts at or below this stock level count as low. */
    public int $lowStockThreshold = 2;

    /**
     * @return Collection<int, Part>
     */
    #[Computed]
    public function lowStockParts(): Collection
    {
        return Part::query()
            ->where('stock', '<=', $this->lowStockThreshold)
            ->orderBy('sku')
            ->get();
    }
}
