<?php

namespace App\Livewire;

use App\Contracts\InvoiceCalculator;
use App\Models\Part;
use App\Models\RepairOrder;
use Livewire\Attributes\Validate;
use Livewire\Component;

/**
 * Child component embedded by the status board.
 *
 * Coverage: #[Validate] property rules, dependency injection in mount()
 * (the container resolves InvoiceCalculator), $this->dispatch() to the
 * parent's #[On] listener, and pivot attach with captured price.
 */
class PartsPicker extends Component
{
    public RepairOrder $order;

    public ?int $partId = null;

    #[Validate('required|integer|min:1|max:99')]
    public int $quantity = 1;

    /** Estimated total, recomputed at mount through the bound calculator. */
    public int $estimateCents = 0;

    public function mount(RepairOrder $order, InvoiceCalculator $calculator): void
    {
        $this->order = $order;
        $this->estimateCents = $calculator->calculate($order);
    }

    public function attach(): void
    {
        $this->validate();

        $part = Part::query()->findOrFail($this->partId);

        $this->order->parts()->attach($part->id, [
            'quantity' => $this->quantity,
            'unit_price_cents' => $part->getRawOriginal('unit_price_cents'),
        ]);

        $this->reset('partId', 'quantity');

        $this->dispatch('part-added', orderId: $this->order->id);
    }

    public function render()
    {
        return view('livewire.parts-picker', [
            'parts' => Part::query()->orderBy('sku')->get(),
        ]);
    }
}
