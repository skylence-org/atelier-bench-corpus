/** Cardinality fixture: structural (object literal, `satisfies`) implementor of RuleContract -- no `implements` keyword. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export const repeatCustomerRule = {
    key: "repeat-customer",
    evaluate(data: Dataset): boolean {
        return data.customers.length >= 1;
    },
} satisfies RuleContract;
