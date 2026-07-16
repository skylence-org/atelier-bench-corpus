<?php

namespace App\Concerns;

use App\Support\Schedule;

/**
 * Magic __call forwarding: the deliberate name_only case.
 *
 * Any undefined method invoked on the using class (Technician) is forwarded
 * to a lazily-built Schedule. Call sites like $technician->nextSlot(...) have
 * no provable receiver member; a correct semantic tool reports them as
 * name_only (or via this __call), never as a silent empty answer.
 */
trait ForwardsToSchedule
{
    private ?Schedule $schedule = null;

    public function schedule(): Schedule
    {
        return $this->schedule ??= new Schedule;
    }

    /**
     * @param  array<int, mixed>  $parameters
     */
    public function __call($method, $parameters)
    {
        if (method_exists(Schedule::class, $method)) {
            return $this->schedule()->{$method}(...$parameters);
        }

        return parent::__call($method, $parameters);
    }
}
