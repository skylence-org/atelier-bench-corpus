/** Read side over recorded payments. */

import type { Repository } from "@atelier/core";

/** One settled payment against an invoice. */
export interface Payment {
    readonly id: number;
    readonly invoiceId: number;
    readonly cents: number;
}

/** Read side over recorded payments. */
export class PaymentRepository implements Repository<number, Payment> {
    constructor(private readonly records: readonly Payment[] = []) {}

    find(id: number): Payment | undefined {
        return this.records.find((record) => record.id === id);
    }

    all(): readonly Payment[] {
        return this.records;
    }

    count(): number {
        return this.records.length;
    }

    /** Total settled amount in cents. */
    settledCents(): number {
        return this.records.reduce((total, payment) => total + payment.cents, 0);
    }
}
