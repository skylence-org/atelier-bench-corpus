/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class ReworkLimitRule implements RuleContract {
    readonly key = "rework-limit";

    evaluate(data: Dataset): boolean {
        return data.orders.length >= 1;
    }
}
