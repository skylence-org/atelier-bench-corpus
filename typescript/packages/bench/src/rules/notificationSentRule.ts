/** Cardinality fixture: structural (object literal) implementor of RuleContract -- no `implements` keyword. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export const notificationSentRule: RuleContract = {
    key: "notification-sent",
    evaluate(data: Dataset): boolean {
        return data.customers.length >= 1;
    },
};
