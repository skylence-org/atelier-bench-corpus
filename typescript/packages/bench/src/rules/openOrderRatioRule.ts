/** Cardinality fixture: structural (object literal, `satisfies`) implementor of RuleContract -- no `implements` keyword. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export const openOrderRatioRule = {
    key: "open-order-ratio",
    evaluate(data: Dataset): boolean {
        return data.openOrders().length >= 1;
    },
} satisfies RuleContract;
