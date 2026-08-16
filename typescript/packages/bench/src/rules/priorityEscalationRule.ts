/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class PriorityEscalationRule implements RuleContract {
    readonly key = "priority-escalation";

    evaluate(data: Dataset): boolean {
        return data.openOrders().length >= 1;
    }
}
