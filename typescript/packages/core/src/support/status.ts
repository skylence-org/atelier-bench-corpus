/** Repair lifecycle states. */

/** Lifecycle state of a {@link  import("../models/repairOrder").RepairOrder}. */
export enum RepairStatus {
    Received = "received",
    Diagnosing = "diagnosing",
    AwaitingParts = "awaiting_parts",
    Repairing = "repairing",
    Completed = "completed",
    Collected = "collected",
}

/**
 * Enum/namespace declaration merging: TypeScript enums cannot carry methods, so
 * the behaviour lives in a namespace with the same name. `RepairStatus.label`
 * and `RepairStatus.Completed` resolve to two different declarations.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RepairStatus {
    const TRANSITIONS: Readonly<Record<RepairStatus, readonly RepairStatus[]>> = {
        [RepairStatus.Received]: [RepairStatus.Diagnosing],
        [RepairStatus.Diagnosing]: [RepairStatus.AwaitingParts, RepairStatus.Repairing],
        [RepairStatus.AwaitingParts]: [RepairStatus.Repairing],
        [RepairStatus.Repairing]: [RepairStatus.Completed],
        [RepairStatus.Completed]: [RepairStatus.Collected],
        [RepairStatus.Collected]: [],
    };

    const LABELS: Readonly<Record<RepairStatus, string>> = {
        [RepairStatus.Received]: "Received",
        [RepairStatus.Diagnosing]: "Diagnosing",
        [RepairStatus.AwaitingParts]: "Awaiting parts",
        [RepairStatus.Repairing]: "Repairing",
        [RepairStatus.Completed]: "Completed",
        [RepairStatus.Collected]: "Collected",
    };

    /** States reachable in one hop from `status`. */
    export function transitionsTo(status: RepairStatus): readonly RepairStatus[] {
        return TRANSITIONS[status];
    }

    /** Human label for report and admin surfaces. */
    export function label(status: RepairStatus): string {
        return LABELS[status];
    }

    /** No further transition is possible from a terminal state. */
    export function isTerminal(status: RepairStatus): boolean {
        return transitionsTo(status).length === 0;
    }

    /** Is the order still occupying bench space? */
    export function isOpen(status: RepairStatus): boolean {
        return status !== RepairStatus.Completed && status !== RepairStatus.Collected;
    }
}
