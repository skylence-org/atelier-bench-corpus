<?php

use App\Enums\RepairStatus;
use App\Models\RepairOrder;
use Livewire\Attributes\Computed;
use Livewire\Component;

/**
 * Livewire 4 SINGLE-FILE component: PHP class + template in one blade file.
 * A parser/indexer must find this anonymous class, its #[Computed] method,
 * and the enum usage inside a file whose extension says "blade".
 */
new class extends Component
{
    public RepairOrder $order;

    /**
     * Percentage through the repair lifecycle, from the enum's case order.
     */
    #[Computed]
    public function progressPercent(): int
    {
        $cases = RepairStatus::cases();
        $index = array_search($this->order->status, $cases, true);

        return (int) round(($index / (count($cases) - 1)) * 100);
    }
};
?>

<div>
    <p>Progress: {{ $this->progressPercent }}%</p>

    <ul>
        @foreach ($order->status->transitionsTo() as $next)
            <li>next: {{ $next->label() }}</li>
        @endforeach
    </ul>
</div>
