/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class RepairDurationRule implements RuleContract {
    readonly key = "repair-duration";

    evaluate(data: Dataset): boolean {
        return data.labourMinutes() > 0;
    }
}
