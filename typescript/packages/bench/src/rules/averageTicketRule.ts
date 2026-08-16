/** Cardinality fixture: structural (object literal, `satisfies`) implementor of RuleContract -- no `implements` keyword. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export const averageTicketRule = {
    key: "average-ticket",
    evaluate(data: Dataset): boolean {
        return data.revenueCents() > 0;
    },
} satisfies RuleContract;
