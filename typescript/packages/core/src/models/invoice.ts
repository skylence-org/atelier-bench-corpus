/** Invoice issued for a completed order. */

import { Money } from "../money";

export class Invoice {
    paid = false;

    constructor(
        readonly id: number,
        readonly repairOrderId: number,
        readonly total: Money,
    ) {}

    markPaid(): boolean {
        if (this.paid) {
            return false;
        }

        this.paid = true;

        return true;
    }

    outstanding(): Money {
        return this.paid ? Money.ZERO : this.total;
    }
}
