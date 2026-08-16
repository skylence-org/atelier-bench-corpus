/** `satisfies` on a config object: the value keeps its literal type, checked against the shape. */

export const rulesConfig = {
    minEvaluations: 1,
    label: "rules",
} satisfies Record<string, number | string>;
