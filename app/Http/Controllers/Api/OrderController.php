<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNoteRequest;
use App\Http\Resources\RepairOrderResource;
use App\Models\RepairOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * JSON API surface over the repair-order hub model: paginated resource
 * collection, single resource via route-model binding by reference, and a
 * FormRequest-validated nested note creation.
 */
class OrderController extends Controller
{
    /**
     * GET /api/orders: paginated collection.
     */
    public function index(): AnonymousResourceCollection
    {
        return RepairOrderResource::collection(
            RepairOrder::query()
                ->with(['customer', 'parts'])
                ->latest('opened_at')
                ->paginate()
        );
    }

    /**
     * GET /api/orders/{repairOrder:reference}: bound by reference, same as web.
     */
    public function show(RepairOrder $repairOrder): RepairOrderResource
    {
        return new RepairOrderResource(
            $repairOrder->load(['customer', 'parts'])
        );
    }

    /**
     * POST /api/orders/{repairOrder:reference}/notes: validated via FormRequest.
     */
    public function storeNote(StoreNoteRequest $request, RepairOrder $repairOrder): JsonResponse
    {
        $note = $repairOrder->notes()->create($request->validated());

        return response()->json([
            'message' => __('atelier.note_created'),
            'note' => $note,
        ], 201);
    }
}
