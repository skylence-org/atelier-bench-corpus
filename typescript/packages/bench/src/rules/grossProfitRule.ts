/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class GrossProfitRule implements RuleContract {
    readonly key = "gross-profit";

    evaluate(data: Dataset): boolean {
        return data.revenueCents() > data.partsCostCents();
    }
}
