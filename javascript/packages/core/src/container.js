/** Runtime binding of contracts to implementations. */

import { RushInvoiceCalculator } from "./services/rushInvoiceCalculator.js";
import { StandardInvoiceCalculator } from "./services/standardInvoiceCalculator.js";

/**
 * Holds the bound implementation behind the contract, so a call site sees only
 * the JSDoc contract and the binding decides the concrete class.
 */
export class Container {
    /** @param {import("./contracts/invoiceCalculator.js").InvoiceCalculator} calculator */
    constructor(calculator) {
        this.calculator = calculator;
    }

    /**
     * Default binding: {@link StandardInvoiceCalculator}.
     *
     * @returns {Container}
     */
    static bindDefault() {
        return new Container(new StandardInvoiceCalculator());
    }

    /**
     * Rush binding: {@link RushInvoiceCalculator}.
     *
     * @returns {Container}
     */
    static bindRush() {
        return new Container(new RushInvoiceCalculator());
    }

    /**
     * @param {import("./contracts/invoiceCalculator.js").InvoiceCalculator} calculator
     * @returns {Container}
     */
    static withInvoiceCalculator(calculator) {
        return new Container(calculator);
    }

    /**
     * The bound strategy; call sites never see a concrete service class.
     *
     * @returns {import("./contracts/invoiceCalculator.js").InvoiceCalculator}
     */
    invoiceCalculator() {
        return this.calculator;
    }
}
