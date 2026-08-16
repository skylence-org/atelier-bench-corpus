/** Append-only audit trail access. */

export interface HasAudit {
    auditTrail(): readonly string[];
    lastAudit(): string | undefined;
    auditDepth(): number;
}

/** Shared implementation the bases delegate to. */
export function lastAuditOf(trail: readonly string[]): string | undefined {
    return trail.at(-1);
}
