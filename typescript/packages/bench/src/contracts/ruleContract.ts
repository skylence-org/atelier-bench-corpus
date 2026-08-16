/** Contract shared by every bench rule: one boolean check over the seeded dataset. */

import type { Dataset } from "../dataset";

/** Something that evaluates a pass/fail check against a {@link Dataset}. */
export interface RuleContract {
    readonly key: string;
    evaluate(data: Dataset): boolean;
}
