/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class LabelPresenceRule implements RuleContract {
    readonly key = "label-presence";

    evaluate(data: Dataset): boolean {
        return data.devices.length >= 1;
    }
}
