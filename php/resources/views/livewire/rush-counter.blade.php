<?php

/*
 * Livewire VOLT functional component: state()/computed() as imported
 * functions, no class at all. A third component authoring style for
 * resolution tooling (class components, SFC anonymous class, and this).
 */

use function Livewire\Volt\{computed, state};

use App\Models\RepairOrder;

state(['label' => 'Rush orders']);

$rushCount = computed(fn (): int => RepairOrder::query()->rush()->count());

?>

<div>
    <p>{{ $label }}: {{ $this->rushCount }}</p>
</div>
