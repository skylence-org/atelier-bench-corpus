/** Cardinality fixture: structural (object literal) implementor of RuleContract -- no `implements` keyword. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export const referencePrefixRule: RuleContract = {
    key: "reference-prefix",
    evaluate(data: Dataset): boolean {
        return data.customers.length >= 1;
    },
};
