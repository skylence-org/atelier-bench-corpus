<?php
/*
 * Folio page with route-model binding IN THE FILENAME: [RepairOrder-reference]
 * binds by the custom `reference` key and injects $repairOrder.
 * GET /orders/AT-2026-000001 resolves here.
 */
?>

<x-layouts.app>
    <h1>{{ $repairOrder->reference }}</h1>
    <p>Status: {{ $repairOrder->status->label() }}</p>
    <p>Customer: {{ $repairOrder->customer->display_name }}</p>
</x-layouts.app>
