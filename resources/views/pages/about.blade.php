<?php
/*
 * Folio page: this file IS the route (GET /about), no routes/web.php entry.
 * Filename-based routing is its own resolution class for indexers.
 */
?>

<x-layouts.app>
    <h1>{{ config('app.name') }} bench corpus</h1>
    <p>Reference prefix: {{ config('atelier.ref_prefix') }}</p>
</x-layouts.app>
