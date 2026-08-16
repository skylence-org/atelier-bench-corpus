/** `unique symbol` used as a property key: nominal identity, never equal to any other symbol. */

const RULE_TAG: unique symbol = Symbol("ruleTag");

export interface TaggedRule {
    [RULE_TAG]: true;
    key: string;
}

export function tag(key: string): TaggedRule {
    return { [RULE_TAG]: true, key };
}
