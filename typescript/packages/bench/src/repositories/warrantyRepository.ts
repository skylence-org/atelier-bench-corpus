/** Read side over warranty claims. */

import type { Repository } from "@atelier/core";

/** One warranty claim raised against an order. */
export interface WarrantyClaim {
    readonly id: number;
    readonly repairOrderId: number;
    readonly settled: boolean;
}

/** Read side over warranty claims. */
export class WarrantyRepository implements Repository<number, WarrantyClaim> {
    constructor(private readonly records: readonly WarrantyClaim[] = []) {}

    find(id: number): WarrantyClaim | undefined {
        return this.records.find((record) => record.id === id);
    }

    all(): readonly WarrantyClaim[] {
        return this.records;
    }

    count(): number {
        return this.records.length;
    }

    /** Claims still awaiting a decision. */
    pending(): readonly WarrantyClaim[] {
        return this.records.filter((claim) => !claim.settled);
    }
}
