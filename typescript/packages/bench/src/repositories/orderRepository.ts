/** Read side over repair orders. */

import type { Repository } from "@atelier/core";
import type { RepairOrder } from "@atelier/core";

/** Read side over repair orders. */
export class OrderRepository implements Repository<number, RepairOrder> {
    constructor(private readonly records: readonly RepairOrder[] = []) {}

    find(id: number): RepairOrder | undefined {
        return this.records.find((record) => record.id === id);
    }

    all(): readonly RepairOrder[] {
        return this.records;
    }

    count(): number {
        return this.records.length;
    }

    /** Orders still occupying bench space. */
    open(): readonly RepairOrder[] {
        return this.records.filter((order) => order.isOpen());
    }
}
