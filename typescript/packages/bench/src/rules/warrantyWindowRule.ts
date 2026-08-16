/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class WarrantyWindowRule implements RuleContract {
    readonly key = "warranty-window";

    evaluate(data: Dataset): boolean {
        return data.devices.length >= 1;
    }
}
