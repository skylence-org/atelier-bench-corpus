<?php

namespace App\Support\Edge;

/**
 * Breadth surface: named-arguments call site.
 */
final class InvoiceLineBuilder
{
    public function build(string $label, int $quantity = 1, int $unitPriceCents = 0): array
    {
        return compact('label', 'quantity', 'unitPriceCents');
    }

    public function buildDefault(): array
    {
        return $this->build(label: 'Diagnostic fee', unitPriceCents: 5000);
    }
}
