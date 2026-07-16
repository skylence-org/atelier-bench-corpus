<?php

namespace Database\Factories;

use App\Models\Note;
use App\Models\RepairOrder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Note>
 */
class NoteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * Sequence-based values keep reruns deterministic: no faker uniqueness.
     * Defaults to a RepairOrder notable; override with ->for($model, 'notable').
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $sequence = 0;
        $sequence++;

        return [
            'body' => "Bench note {$sequence}",
            'author' => 'bench',
            'notable_id' => RepairOrder::factory(),
            'notable_type' => RepairOrder::class,
        ];
    }
}
