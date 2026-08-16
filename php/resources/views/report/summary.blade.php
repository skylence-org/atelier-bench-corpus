<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Repair report {{ $order->reference }}</title>
</head>
<body>
{{-- Blade indexing coverage: model attribute echoes, enum method call,
     relationship traversal, and an @foreach over a BelongsToMany. --}}
<h1>{{ $order->reference }}</h1>

<p>{{ $statusLine }}</p>
<p>Customer: {{ $order->customer->display_name }}</p>
<p>Device: {{ $order->device->label() }}</p>
<p>Priority: {{ $order->priority->weight() }}</p>

<ul>
    @foreach ($order->parts as $part)
        <li>{{ $part->name }} x{{ $part->pivot->quantity }}</li>
    @endforeach
</ul>

<p>Total: {{ $moneyLine }}</p>

{{-- Livewire 4 single-file component embed (tag resolution → ⚡order-tracker) --}}
<livewire:order-tracker :order="$order" />
<x-status-badge :status="$order->status" />

@livewireScripts
</body>
</html>
