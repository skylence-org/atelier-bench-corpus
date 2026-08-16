<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\RepairOrder
 */
class RepairOrderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'reference' => $this->reference,
            'status' => $this->status->value,
            'priority' => $this->priority->value,
            'subtotal_cents' => $this->subtotal_cents,
            'opened_at' => $this->opened_at,
            'completed_at' => $this->completed_at,
            'customer' => $this->whenLoaded('customer'),
            'parts' => PartResource::collection($this->whenLoaded('parts')),
        ];
    }
}
