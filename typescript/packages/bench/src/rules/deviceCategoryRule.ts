/** Cardinality fixture: structural (object literal, `satisfies`) implementor of RuleContract -- no `implements` keyword. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export const deviceCategoryRule = {
    key: "device-category",
    evaluate(data: Dataset): boolean {
        return data.devices.length >= 1;
    },
} satisfies RuleContract;
