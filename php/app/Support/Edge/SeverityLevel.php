<?php

namespace App\Support\Edge;

interface HasLabel
{
    public function label(): string;
}

/**
 * Breadth surface: enum implementing an interface, with a class const and a
 * static factory method.
 */
enum SeverityLevel: string implements HasLabel
{
    case Low = 'low';
    case Medium = 'medium';
    case High = 'high';

    public const self Default = self::Low;

    public static function fromScore(int $score): self
    {
        return match (true) {
            $score >= 8 => self::High,
            $score >= 4 => self::Medium,
            default => self::Low,
        };
    }

    public function label(): string
    {
        return ucfirst($this->value);
    }
}

final class SeverityLevelDemo
{
    public function classify(int $score): SeverityLevel
    {
        return SeverityLevel::fromScore($score);
    }
}
