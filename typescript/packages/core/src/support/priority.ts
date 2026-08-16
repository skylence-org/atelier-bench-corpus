/** Order priority and its pricing effect. */

export enum Priority {
    Standard = "standard",
    Rush = "rush",
    Warranty = "warranty",
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Priority {
    const SURCHARGE_BP: Readonly<Record<Priority, number>> = {
        [Priority.Standard]: 0,
        [Priority.Rush]: 2500,
        [Priority.Warranty]: 0,
    };

    const LABELS: Readonly<Record<Priority, string>> = {
        [Priority.Standard]: "Standard",
        [Priority.Rush]: "Rush",
        [Priority.Warranty]: "Warranty",
    };

    /** Surcharge in basis points applied to the labour subtotal. */
    export function surchargeBp(priority: Priority): number {
        return SURCHARGE_BP[priority];
    }

    export function label(priority: Priority): string {
        return LABELS[priority];
    }

    /** Rush work jumps the queue; warranty work does not. */
    export function isExpedited(priority: Priority): boolean {
        return priority === Priority.Rush;
    }

    /** Warranty orders are never invoiced to the customer. */
    export function isBillable(priority: Priority): boolean {
        return priority !== Priority.Warranty;
    }
}
