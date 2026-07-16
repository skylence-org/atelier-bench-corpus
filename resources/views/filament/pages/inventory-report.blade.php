<x-filament-panels::page>
    {{-- $this->lowStockParts resolves via the #[Computed] attribute --}}
    <ul>
        @forelse ($this->lowStockParts as $part)
            <li>{{ $part->sku }}: {{ $part->name }} ({{ $part->stock }} left)</li>
        @empty
            <li>All parts sufficiently stocked.</li>
        @endforelse
    </ul>
</x-filament-panels::page>
