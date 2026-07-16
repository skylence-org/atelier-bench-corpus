<?php

namespace App\Models;

use App\Casts\Money;
use App\Concerns\HasReference;
use App\Enums\Priority;
use App\Enums\RepairStatus;
use App\Events\RepairCompleted;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * The hub model: most benchmark tasks route through here.
 *
 * @property string $reference
 * @property RepairStatus $status
 * @property Priority $priority
 * @property string $subtotal_cents money as decimal string via the Money cast
 */
class RepairOrder extends Model
{
    use HasReference;

    protected $guarded = [];

    /**
     * In-memory defaults matching the DB defaults, so a fresh create() has a
     * usable enum immediately (DB column defaults are not hydrated back).
     */
    protected $attributes = [
        'status' => 'received',
        'priority' => 'normal',
    ];

    protected function casts(): array
    {
        return [
            'status' => RepairStatus::class,
            'priority' => Priority::class,
            'subtotal_cents' => Money::class,
            'opened_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    public function technician(): BelongsTo
    {
        return $this->belongsTo(Technician::class);
    }

    public function parts(): BelongsToMany
    {
        return $this->belongsToMany(Part::class)
            ->withPivot(['quantity', 'unit_price_cents'])
            ->withTimestamps();
    }

    public function notes(): MorphMany
    {
        return $this->morphMany(Note::class, 'notable');
    }

    public function statusLogs(): HasMany
    {
        return $this->hasMany(StatusLog::class);
    }

    /**
     * Open (non-terminal) orders.
     */
    public function scopeOpen(Builder $query): Builder
    {
        return $query->whereNotIn('status', [RepairStatus::Delivered->value]);
    }

    /**
     * Rush-priority orders, newest first.
     */
    public function scopeRush(Builder $query): Builder
    {
        return $query
            ->where('priority', Priority::Rush->value)
            ->latest('opened_at');
    }

    /**
     * Advance to a new status, logging the transition.
     *
     * Central references target: called from the Filament action, the report
     * controller flow, complete(), and the seeder.
     */
    public function transitionTo(RepairStatus $next, string $changedBy): bool
    {
        if (! in_array($next, $this->status->transitionsTo(), true)) {
            return false;
        }

        $previous = $this->status;

        $this->forceFill(['status' => $next])->save();

        $this->statusLogs()->create([
            'from' => $previous->value,
            'to' => $next->value,
            'changed_by' => $changedBy,
        ]);

        return true;
    }

    /**
     * Finish the repair: transition, price via the bound InvoiceCalculator,
     * stamp completion, fire the event.
     *
     * symbol_card / call-hierarchy hub: known callers are the Filament
     * CompleteAction and the seeder; pricing routes through the
     * container-bound InvoiceCalculator implementation.
     */
    public function complete(string $changedBy): bool
    {
        if (! $this->transitionTo(RepairStatus::Completed, $changedBy)) {
            return false;
        }

        $this->forceFill([
            'completed_at' => now(),
            'subtotal_cents' => app(\App\Contracts\InvoiceCalculator::class)->calculate($this),
        ])->save();

        RepairCompleted::dispatch($this);

        return true;
    }
}
