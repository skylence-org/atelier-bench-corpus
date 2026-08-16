/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class PartCostMarginRule implements RuleContract {
    readonly key = "part-cost-margin";

    evaluate(data: Dataset): boolean {
        return data.partsCostCents() > 0;
    }
}
