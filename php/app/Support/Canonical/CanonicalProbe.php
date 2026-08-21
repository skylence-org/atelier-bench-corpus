<?php

namespace App\Support\Canonical;

use App\Contracts\InvoiceCalculator;
use App\Enums\Priority;
use App\Models\RepairOrder;
use App\Support\Canonical\Exports\Ledger as ExportedLedger;
use App\Support\Reference;

/**
 * Call sites for the canonical ids php previously scored only under lane-local
 * ids: global function, class constant, static factory, container-resolved
 * contract method, barrel import and error subclass.
 */
final class CanonicalProbe
{
    public function formattedReference(int $number): string
    {
        return atelier_format_reference('CN', $number);
    }

    public function separator(): string
    {
        $separator = Reference::PREFIX_SEPARATOR;

        return $separator;
    }

    public function rushPriority(): Priority
    {
        return Priority::fromWeight(2);
    }

    public function invoiceTotal(RepairOrder $order): int
    {
        return app(InvoiceCalculator::class)->calculate($order);
    }

    public function ledgerTotal(int $cents): int
    {
        return (new ExportedLedger())->add($cents)->totalCents();
    }

    public function requireReference(?string $reference): string
    {
        if (blank($reference)) {
            throw new NotFoundError('repair order', (string) $reference);
        }

        return $reference;
    }
}
