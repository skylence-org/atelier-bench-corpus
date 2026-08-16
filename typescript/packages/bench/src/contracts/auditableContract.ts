/** Audit-entry production. */

/** One recorded action. */
export interface AuditEntry {
    readonly id: string;
    readonly actor: string;
    readonly action: string;
}

/** Anything that can stamp an audit entry. */
export interface AuditableContract {
    /** Who is acting, for the entry's actor field. */
    auditActor(): string;

    /** Stamp an entry with a fresh id. */
    audit(action: string): AuditEntry;
}
