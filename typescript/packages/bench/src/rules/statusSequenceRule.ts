/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class StatusSequenceRule implements RuleContract {
    readonly key = "status-sequence";

    evaluate(data: Dataset): boolean {
        return data.completedOrders().length >= 1;
    }
}
