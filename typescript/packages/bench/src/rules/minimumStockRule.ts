/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class MinimumStockRule implements RuleContract {
    readonly key = "minimum-stock";

    evaluate(data: Dataset): boolean {
        return data.parts.length >= 1;
    }
}
