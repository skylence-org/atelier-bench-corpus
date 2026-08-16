/** Namespace import: only RULES is read off the namespace object. */

import * as Rules from "../rules";

export function ruleCount(): number {
    return Rules.RULES.length;
}
