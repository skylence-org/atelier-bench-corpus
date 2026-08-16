/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class InvoiceBalanceRule implements RuleContract {
    readonly key = "invoice-balance";

    evaluate(data: Dataset): boolean {
        return data.invoices.length >= 1;
    }
}
