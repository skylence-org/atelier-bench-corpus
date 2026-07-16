<?php

namespace App\Livewire;

use App\Models\RepairOrder;
use Livewire\Attributes\Locked;
use Livewire\Attributes\On;
use Livewire\Attributes\Url;
use Livewire\Component;
use Livewire\WithPagination;

/**
 * Full-page Livewire component (routed at /board).
 *
 * Coverage: WithPagination trait, #[Url] query-string prop, #[Locked] prop,
 * #[On] event listener (fired by PartsPicker/NoteComposer), lifecycle hook
 * (updatedStatusFilter), and yet another caller of RepairOrder::complete().
 */
class StatusBoard extends Component
{
    use WithPagination;

    /** Filter synced to the ?status= query string. */
    #[Url(as: 'status')]
    public string $statusFilter = '';

    /** Tamper-proof page size: a Livewire payload cannot change it. */
    #[Locked]
    public int $perPage = 5;

    /** Lifecycle hook: any filter change resets pagination. */
    public function updatedStatusFilter(): void
    {
        $this->resetPage();
    }

    /** Child components dispatch these after mutating an order. */
    #[On('part-added')]
    #[On('note-added')]
    public function refreshBoard(): void
    {
        // Listener body intentionally empty: receiving the event is enough,
        // Livewire re-renders this component after any handled dispatch.
    }

    public function completeOrder(int $orderId): void
    {
        $order = RepairOrder::query()->findOrFail($orderId);

        $order->complete(auth()->user()->name ?? 'board');

        $this->dispatch('order-completed', orderId: $orderId);
    }

    public function render()
    {
        $orders = RepairOrder::query()
            ->with(['customer', 'technician'])
            ->when($this->statusFilter !== '', fn ($query) => $query->where('status', $this->statusFilter))
            ->latest('opened_at')
            ->paginate($this->perPage);

        return view('livewire.status-board', ['orders' => $orders]);
    }
}
