/** Cardinality fixture: structural (object literal, `satisfies`) implementor of RuleContract -- no `implements` keyword. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export const inventoryTurnoverRule = {
    key: "inventory-turnover",
    evaluate(data: Dataset): boolean {
        return data.parts.length >= 1;
    },
} satisfies RuleContract;
