/** Cardinality fixture: structural (object literal, `satisfies`) implementor of RuleContract -- no `implements` keyword. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export const completionRateRule = {
    key: "completion-rate",
    evaluate(data: Dataset): boolean {
        return data.completedOrders().length >= 1;
    },
} satisfies RuleContract;
