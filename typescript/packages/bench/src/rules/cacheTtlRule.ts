/** Cardinality fixture: structural (object literal) implementor of RuleContract -- no `implements` keyword. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export const cacheTtlRule: RuleContract = {
    key: "cache-ttl",
    evaluate(data: Dataset): boolean {
        return data.parts.length >= 1;
    },
};
