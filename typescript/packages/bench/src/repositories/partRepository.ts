/** Read side over the parts catalogue. */

import type { Repository } from "@atelier/core";
import type { Part } from "@atelier/core";

/** Read side over the parts catalogue. */
export class PartRepository implements Repository<number, Part> {
    constructor(private readonly records: readonly Part[] = []) {}

    find(id: number): Part | undefined {
        return this.records.find((record) => record.id === id);
    }

    all(): readonly Part[] {
        return this.records;
    }

    count(): number {
        return this.records.length;
    }

    /** Catalogue lookup by stock-keeping unit. */
    bySku(sku: string): Part | undefined {
        return this.records.find((part) => part.sku === sku);
    }
}
