/** Cardinality fixture: structural (object literal) implementor of RuleContract -- no `implements` keyword. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export const partCountRule: RuleContract = {
    key: "part-count",
    evaluate(data: Dataset): boolean {
        return data.parts.length >= 1;
    },
};
