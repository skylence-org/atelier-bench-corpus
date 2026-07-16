<div>
    <p>{{ $noteCount }} note(s)</p>

    {{-- Form-object binding: form.body resolves through NoteForm --}}
    <textarea wire:model.blur="form.body" placeholder="add a note"></textarea>
    @error('form.body') <span>{{ $message }}</span> @enderror

    <button wire:click="save">Save note</button>
</div>
