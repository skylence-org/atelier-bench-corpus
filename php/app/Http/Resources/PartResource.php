<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Part
 */
class PartResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'sku' => $this->sku,
            'name' => $this->name,
            'unit_price_cents' => $this->unit_price_cents,
            'quantity' => $this->whenPivotLoaded(
                'part_repair_order',
                fn () => $this->pivot->quantity,
            ),
        ];
    }
}
