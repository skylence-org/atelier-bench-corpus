/** Read side over issued invoices. */

import type { Repository } from "@atelier/core";
import type { Invoice } from "@atelier/core";

/** Read side over issued invoices. */
export class InvoiceRepository implements Repository<number, Invoice> {
    constructor(private readonly records: readonly Invoice[] = []) {}

    find(id: number): Invoice | undefined {
        return this.records.find((record) => record.id === id);
    }

    all(): readonly Invoice[] {
        return this.records;
    }

    count(): number {
        return this.records.length;
    }

    /** Invoices still carrying a balance. */
    unpaid(): readonly Invoice[] {
        return this.records.filter((invoice) => !invoice.paid);
    }
}
