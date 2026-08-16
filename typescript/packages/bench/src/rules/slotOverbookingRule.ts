/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class SlotOverbookingRule implements RuleContract {
    readonly key = "slot-overbooking";

    evaluate(data: Dataset): boolean {
        return data.technicians.length >= 1;
    }
}
