<?php

namespace App\Support\Canonical\Wave2;

use App\Bench\Repositories\{CustomerRepository,
    InventoryRepository,
    InvoiceRepository,
    OrderRepository,
    PartRepository,
    PaymentRepository,
    TechnicianRepository,
    WarrantyRepository};

/**
 * PHP's one-statement-many-names import: the brace group binds exactly the eight
 * names listed and nothing else from App\Bench\Repositories. This is the lane's
 * equivalent of the rust, python and go glob question.
 */
final class RepositoryGlob
{
    /** @return list<class-string<\App\Bench\Contracts\RepositoryContract>> */
    public static function all(): array
    {
        return [
            CustomerRepository::class,
            InventoryRepository::class,
            InvoiceRepository::class,
            OrderRepository::class,
            PartRepository::class,
            PaymentRepository::class,
            TechnicianRepository::class,
            WarrantyRepository::class,
        ];
    }

    public static function total(): float
    {
        return array_sum(array_map(
            static fn (string $repository): float => (new $repository())->sum(),
            self::all(),
        ));
    }
}
