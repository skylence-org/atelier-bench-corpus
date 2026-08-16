<?php

namespace App\Livewire;

use App\Livewire\Forms\NoteForm;
use App\Models\RepairOrder;
use Livewire\Component;

/**
 * Coverage: Livewire Form object property ($this->form), wire:model.blur
 * binding into the form, dispatch to the board's #[On('note-added')].
 */
class NoteComposer extends Component
{
    public RepairOrder $order;

    public NoteForm $form;

    public function save(): void
    {
        $this->form->store($this->order);

        $this->dispatch('note-added', orderId: $this->order->id);
    }

    public function render()
    {
        return view('livewire.note-composer', [
            'noteCount' => $this->order->notes()->count(),
        ]);
    }
}
