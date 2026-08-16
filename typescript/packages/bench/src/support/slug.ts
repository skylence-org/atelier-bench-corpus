/** Template literal type: every Slug ends in `-report`. */

export type Slug = `${Lowercase<string>}-report`;

export const cashFlowSlug: Slug = "cash-flow-report";
