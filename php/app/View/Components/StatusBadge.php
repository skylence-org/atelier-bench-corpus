<?php

namespace App\View\Components;

use App\Enums\RepairStatus;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

/**
 * Class-based Blade component: <x-status-badge :status="..." />.
 * Takes the RepairStatus enum and exposes its human label to the view.
 */
class StatusBadge extends Component
{
    public string $label;

    public function __construct(
        public RepairStatus $status,
    ) {
        $this->label = $status->label();
    }

    public function render(): View
    {
        return view('components.status-badge');
    }
}
