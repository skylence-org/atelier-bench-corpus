/** Generic storage contract with two type parameters. */

/**
 * Read-side storage abstraction. Implementors pin `Id` and `Record` to
 * concrete types, so a lookup on `find` must follow the instantiation.
 */
export interface Repository<Id, Rec> {
    find(id: Id): Rec | undefined;

    all(): readonly Rec[];

    count(): number;
}

/** Anything addressable by a numeric id. */
export interface Identified {
    readonly id: number;
}
