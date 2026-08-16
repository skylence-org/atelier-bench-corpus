/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class MaximumBacklogRule implements RuleContract {
    readonly key = "maximum-backlog";

    evaluate(data: Dataset): boolean {
        return data.openOrders().length >= 1;
    }
}
