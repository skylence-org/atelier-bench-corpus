/**
 * Billing-side formatter.
 *
 * Shadow pair: `../reporting/formatter` exports a class with the same name.
 * Call sites import both and alias them.
 */

import type { Money } from "../money";

/** Formats amounts for invoices. */
export class Formatter {
    constructor(private readonly currency = "EUR") {}

    /** Render `amount` with a currency suffix. */
    money(amount: Money, currency = ""): string {
        return `${amount.toString()} ${currency === "" ? this.currency : currency}`;
    }

    /** Invoice line: quantity, description, extended amount. */
    line(quantity: number, description: string, amount: Money): string {
        return `${quantity} x ${description} = ${this.money(amount)}`;
    }
}
