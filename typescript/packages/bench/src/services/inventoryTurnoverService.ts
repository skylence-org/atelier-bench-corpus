/** Consumption against shelf depth. */

import type { Dataset } from "../dataset";
import { AbstractService } from "../support/abstractService";

/** Consumption against shelf depth. */
export class InventoryTurnoverService extends AbstractService {
    /** Service name, used as the audit actor. */
    static readonly NAME = "inventory-turnover";

    constructor() {
        super(InventoryTurnoverService.NAME);
    }

    /** Turnover for one sku, or undefined when the sku is unknown. */
    forSku(data: Dataset, sku: string): number | undefined {
        const part = data.part(sku);
        if (part === undefined) {
            return undefined;
        }

        return part.stock === 0 ? 0 : part.consumedQuantity() / part.stock;
    }
}
