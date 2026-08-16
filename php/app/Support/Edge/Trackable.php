<?php

namespace App\Support\Edge;

use Attribute;
use ReflectionMethod;

/**
 * Breadth surface: #[Attribute] class applied to a method, read via
 * reflection.
 */
#[Attribute]
final class Trackable
{
    public function __construct(public readonly string $label = 'default')
    {
    }
}

final class MetricsProbe
{
    #[Trackable('probe-heartbeat')]
    public function heartbeat(): bool
    {
        return true;
    }

    public static function readTrackable(): ?Trackable
    {
        $method = new ReflectionMethod(self::class, 'heartbeat');
        $attrs = $method->getAttributes(Trackable::class);

        return $attrs === [] ? null : $attrs[0]->newInstance();
    }
}
