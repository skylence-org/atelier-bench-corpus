/** Cardinality fixture: structural (object literal) implementor of RuleContract -- no `implements` keyword. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export const taxAppliedRule: RuleContract = {
    key: "tax-applied",
    evaluate(data: Dataset): boolean {
        return data.invoices.length >= 1;
    },
};
