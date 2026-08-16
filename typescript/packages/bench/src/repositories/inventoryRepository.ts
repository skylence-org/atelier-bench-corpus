/** Read side over stock movements. */

import type { Repository } from "@atelier/core";

/** One stock in/out movement. */
export interface StockMovement {
    readonly id: number;
    readonly sku: string;
    readonly delta: number;
}

/** Read side over stock movements. */
export class InventoryRepository implements Repository<number, StockMovement> {
    constructor(private readonly records: readonly StockMovement[] = []) {}

    find(id: number): StockMovement | undefined {
        return this.records.find((record) => record.id === id);
    }

    all(): readonly StockMovement[] {
        return this.records;
    }

    count(): number {
        return this.records.length;
    }

    /** Net movement for one sku. */
    netFor(sku: string): number {
        return this.records
            .filter((movement) => movement.sku === sku)
            .reduce((total, movement) => total + movement.delta, 0);
    }
}
