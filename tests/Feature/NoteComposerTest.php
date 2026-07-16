<?php

namespace Tests\Feature;

use App\Livewire\NoteComposer;
use App\Models\RepairOrder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class NoteComposerTest extends TestCase
{
    use RefreshDatabase;

    public function test_save_rejects_a_too_short_body(): void
    {
        $order = RepairOrder::factory()->create();

        Livewire::test(NoteComposer::class, ['order' => $order])
            ->set('form.body', 'ab')
            ->call('save')
            ->assertHasErrors(['form.body' => 'min']);

        $this->assertDatabaseCount('notes', 0);
    }

    public function test_save_stores_the_note_and_dispatches_note_added(): void
    {
        $order = RepairOrder::factory()->create();

        Livewire::test(NoteComposer::class, ['order' => $order])
            ->set('form.body', 'Replaced the battery connector')
            ->call('save')
            ->assertHasNoErrors()
            ->assertDispatched('note-added', orderId: $order->id);

        $this->assertDatabaseHas('notes', [
            'notable_type' => RepairOrder::class,
            'notable_id' => $order->id,
            'body' => 'Replaced the battery connector',
            'author' => 'bench',
        ]);
    }
}
