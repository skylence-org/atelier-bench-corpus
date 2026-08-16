/** Customer record. */

import { withReference } from "../concerns/hasReference";

class CustomerBase {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly email: string,
        public phone?: string,
    ) {}
}

/**
 * Owner of one or more devices.
 *
 * `reference()` comes from the mixin, not from this file.
 */
export class Customer extends withReference(CustomerBase, "CU") {
    /** Display name used in tables and the report header. */
    displayName(): string {
        return `${this.name} <${this.email}>`;
    }

    isReachable(): boolean {
        return this.phone !== undefined || this.email !== "";
    }

    static seed(id: number, name: string, email: string, phone?: string): Customer {
        const customer = new Customer(id, name, email, phone);
        customer.referenceNumber = id;

        return customer;
    }
}
