/** Cardinality fixture: structural (object literal, `satisfies`) implementor of RuleContract -- no `implements` keyword. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export const invoiceCountRule = {
    key: "invoice-count",
    evaluate(data: Dataset): boolean {
        return data.invoices.length >= 1;
    },
} satisfies RuleContract;
