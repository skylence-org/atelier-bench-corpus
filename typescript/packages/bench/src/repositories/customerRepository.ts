/** Read side over seeded customers. */

import type { Repository } from "@atelier/core";
import type { Customer } from "@atelier/core";

/** Read side over seeded customers. */
export class CustomerRepository implements Repository<number, Customer> {
    constructor(private readonly records: readonly Customer[] = []) {}

    find(id: number): Customer | undefined {
        return this.records.find((record) => record.id === id);
    }

    all(): readonly Customer[] {
        return this.records;
    }

    count(): number {
        return this.records.length;
    }

    /** Customers reachable by phone or email. */
    reachable(): readonly Customer[] {
        return this.records.filter((customer) => customer.isReachable());
    }
}
