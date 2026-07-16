<div>
    <p>Estimate: {{ $estimateCents }} cents</p>

    <select wire:model="partId">
        <option value="">pick a part</option>
        @foreach ($parts as $part)
            <option value="{{ $part->id }}">{{ $part->sku }}: {{ $part->name }}</option>
        @endforeach
    </select>

    <input type="number" wire:model="quantity" min="1" />
    @error('quantity') <span>{{ $message }}</span> @enderror

    {{-- wire:click resolves to PartsPicker::attach --}}
    <button wire:click="attach">Add part</button>
</div>
