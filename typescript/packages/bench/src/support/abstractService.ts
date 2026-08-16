/** Base shared by all 12 services. */

import { v4 as uuid } from "uuid";

import type { AuditEntry, AuditableContract } from "../contracts/auditableContract";
import { lastAuditOf, type HasAudit } from "../concerns/hasAudit";

export abstract class AbstractService implements AuditableContract, HasAudit {
    private readonly trail: string[] = [];

    protected constructor(readonly name: string) {}

    /** Record one action on this service's trail. */
    record(action: string): void {
        this.trail.push(action);
    }

    auditTrail(): readonly string[] {
        return this.trail;
    }

    lastAudit(): string | undefined {
        return lastAuditOf(this.trail);
    }

    auditDepth(): number {
        return this.trail.length;
    }

    auditActor(): string {
        return this.name;
    }

    audit(action: string): AuditEntry {
        return { id: uuid(), actor: this.auditActor(), action };
    }
}
