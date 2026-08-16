/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class ScheduleGapRule implements RuleContract {
    readonly key = "schedule-gap";

    evaluate(data: Dataset): boolean {
        return data.technicians.length >= 1;
    }
}
