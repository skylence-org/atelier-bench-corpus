<?php

namespace App\Support\Canonical\Wave2;

/**
 * The only consumer of OrderStream::each(): the foreach drives the generator.
 */
final class StreamConsumer
{
    /** @return list<string> */
    public function collect(OrderStream $stream): array
    {
        $collected = [];

        foreach ($stream->each() as $reference) {
            $collected[] = $reference;
        }

        return $collected;
    }
}
