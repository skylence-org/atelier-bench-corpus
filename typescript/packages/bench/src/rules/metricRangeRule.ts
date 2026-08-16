/** Cardinality fixture: structural (object literal) implementor of RuleContract -- no `implements` keyword. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export const metricRangeRule: RuleContract = {
    key: "metric-range",
    evaluate(data: Dataset): boolean {
        return data.technicians.length >= 1;
    },
};
