<?php

namespace App\Support;

use Carbon\CarbonImmutable;

/**
 * The real implementation behind Technician's magic-forwarded calls.
 *
 * Technician::nextSlot() / Technician::bookSlot() do not exist as methods on
 * Technician; they resolve here through ForwardsToSchedule::__call. A semantic
 * tool should tag call sites on Technician as name_only (receiver type cannot
 * prove the member), while direct calls on Schedule are exact.
 */
class Schedule
{
    /** @var array<int, CarbonImmutable> */
    private array $booked = [];

    /**
     * Earliest free slot strictly after the given instant.
     */
    public function nextSlot(CarbonImmutable $after): CarbonImmutable
    {
        $candidate = $after->addHour()->startOfHour();

        while (in_array($candidate, $this->booked, false)) {
            $candidate = $candidate->addHour();
        }

        return $candidate;
    }

    /**
     * Reserve a slot; returns false when it was already taken.
     */
    public function bookSlot(CarbonImmutable $slot): bool
    {
        if (in_array($slot, $this->booked, false)) {
            return false;
        }

        $this->booked[] = $slot;

        return true;
    }
}
