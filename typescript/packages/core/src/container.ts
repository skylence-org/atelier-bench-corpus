/** Runtime binding of contracts to implementations. */

import type { InvoiceCalculator } from "./contracts/invoiceCalculator";
import { RushInvoiceCalculator } from "./services/rushInvoiceCalculator";
import { StandardInvoiceCalculator } from "./services/standardInvoiceCalculator";

/**
 * Holds the bound implementation behind the interface, so a call site sees
 * only the contract and the binding decides the concrete class.
 */
export class Container {
    private constructor(private readonly calculator: InvoiceCalculator) {}

    /** Default binding: {@link StandardInvoiceCalculator}. */
    static bindDefault(): Container {
        return new Container(new StandardInvoiceCalculator());
    }

    /** Rush binding: {@link RushInvoiceCalculator}. */
    static bindRush(): Container {
        return new Container(new RushInvoiceCalculator());
    }

    static withInvoiceCalculator(calculator: InvoiceCalculator): Container {
        return new Container(calculator);
    }

    /** The bound strategy; call sites never see a concrete service class. */
    invoiceCalculator(): InvoiceCalculator {
        return this.calculator;
    }
}
