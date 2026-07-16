<?php

namespace App\Livewire\Forms;

use App\Models\RepairOrder;
use Livewire\Attributes\Validate;
use Livewire\Form;

/**
 * Livewire Form object: validation lives on the form class, the component
 * proxies to it ($this->form->body resolves through Form magic).
 */
class NoteForm extends Form
{
    #[Validate('required|string|min:3|max:500')]
    public string $body = '';

    #[Validate('required|string|max:60')]
    public string $author = 'bench';

    public function store(RepairOrder $order): void
    {
        $this->validate();

        $order->notes()->create($this->only(['body', 'author']));

        $this->reset('body');
    }
}
