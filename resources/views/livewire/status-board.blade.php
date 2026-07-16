<div>
    {{-- #[Url] binding: typing here rewrites ?status= --}}
    <input type="text" wire:model.live="statusFilter" placeholder="status filter" />

    <table>
        @foreach ($orders as $order)
            <tr wire:key="order-{{ $order->id }}">
                <td>{{ $order->reference }}</td>
                <td>{{ $order->customer->display_name }}</td>
                <td>{{ $order->status->label() }}</td>
                <td>
                    {{-- wire:click resolves to StatusBoard::completeOrder --}}
                    <button wire:click="completeOrder({{ $order->id }})">Complete</button>
                </td>
            </tr>
        @endforeach
    </table>

    {{ $orders->links() }}

    {{-- Nested children: events flow back up via #[On] --}}
    @if ($first = $orders->first())
        <livewire:parts-picker :order="$first" :key="'picker-'.$first->id" />
        <livewire:note-composer :order="$first" :key="'notes-'.$first->id" />
    @endif
</div>
