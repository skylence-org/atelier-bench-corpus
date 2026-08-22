<?php

namespace App\Bench\Contracts;

/**
 * Docblock-generic repository contract: one interface, eight instantiations.
 *
 * PHP has no runtime generics, so the type parameter lives in @template and the
 * eight implementors under app/Bench/Repositories/ each pin it in their own
 * docblocks. Same question as the typescript, python and go lanes.
 *
 * @template TRecord
 */
interface RepositoryContract
{
    /** @return list<TRecord> */
    public function all(): array;

    public function count(): int;

    public function sum(): float;
}
