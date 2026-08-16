/** Cardinality fixture: structural (object literal) implementor of RuleContract -- no `implements` keyword. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export const roundingRule: RuleContract = {
    key: "rounding",
    evaluate(data: Dataset): boolean {
        return data.revenueCents() >= 0;
    },
};
