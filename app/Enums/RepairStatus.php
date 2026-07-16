<?php

namespace App\Enums;

/**
 * Repair lifecycle. Backed enum with methods: enum-case definition targets,
 * enum-method hover targets, and match-arm references.
 */
enum RepairStatus: string
{
    case Received = 'received';
    case Diagnosing = 'diagnosing';
    case AwaitingParts = 'awaiting_parts';
    case Repairing = 'repairing';
    case Completed = 'completed';
    case Delivered = 'delivered';

    /**
     * Human label for UI tables and the report blade.
     */
    public function label(): string
    {
        return match ($this) {
            self::Received => 'Received',
            self::Diagnosing => 'Diagnosing',
            self::AwaitingParts => 'Awaiting parts',
            self::Repairing => 'Repairing',
            self::Completed => 'Completed',
            self::Delivered => 'Delivered',
        };
    }

    /**
     * Terminal states allow no further transitions.
     */
    public function isTerminal(): bool
    {
        return $this === self::Delivered;
    }

    /**
     * @return list<self> legal next states from this one
     */
    public function transitionsTo(): array
    {
        return match ($this) {
            self::Received => [self::Diagnosing],
            self::Diagnosing => [self::AwaitingParts, self::Repairing],
            self::AwaitingParts => [self::Repairing],
            self::Repairing => [self::Completed],
            self::Completed => [self::Delivered],
            self::Delivered => [],
        };
    }
}
