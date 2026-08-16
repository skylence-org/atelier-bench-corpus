/** Polymorphic note attachable to several record kinds. */

/** What a note can hang off. */
export enum NotableKind {
    Customer = "customer",
    Device = "device",
    RepairOrder = "repair_order",
    Part = "part",
}

export class Note {
    constructor(
        readonly id: number,
        readonly notableKind: NotableKind,
        readonly notableId: number,
        readonly body: string,
        readonly author = "system",
    ) {}

    excerpt(width: number): string {
        return this.body.length <= width ? this.body : `${this.body.slice(0, width - 1)}…`;
    }
}
