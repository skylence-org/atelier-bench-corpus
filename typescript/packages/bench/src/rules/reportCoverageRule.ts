/** Cardinality fixture: structural (object literal) implementor of RuleContract -- no `implements` keyword. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export const reportCoverageRule: RuleContract = {
    key: "report-coverage",
    evaluate(data: Dataset): boolean {
        return data.orders.length >= 1;
    },
};
