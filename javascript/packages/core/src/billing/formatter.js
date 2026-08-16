/**
 * Billing-side formatter.
 *
 * Shadow pair: `../reporting/formatter.js` exports a class with the same name
 * and an unrelated method set. Call sites import both and alias them.
 */

export class Formatter {
    /** @param {string} [currency] */
    constructor(currency = "EUR") {
        this.currency = currency;
    }

    /**
     * Render `amount` with a currency suffix.
     *
     * @param {import("../money.js").Money} amount
     * @param {string} [currency]
     * @returns {string}
     */
    money(amount, currency = "") {
        return `${amount.toString()} ${currency === "" ? this.currency : currency}`;
    }

    /**
     * Invoice line: quantity, description, extended amount.
     *
     * @param {number} quantity
     * @param {string} description
     * @param {import("../money.js").Money} amount
     * @returns {string}
     */
    line(quantity, description, amount) {
        return `${quantity} x ${description} = ${this.money(amount)}`;
    }
}
