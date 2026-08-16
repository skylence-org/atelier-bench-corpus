/** Many-to-many label attachable to several record kinds. */

import type { NotableKind } from "./note";

/** Join row: the analogue of a polymorphic pivot table. */
export interface Labelable {
    readonly labelId: number;
    readonly kind: NotableKind;
    readonly recordId: number;
}

export class Label {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly colour = "slate",
    ) {}

    /** Records of `kind` carrying this label. */
    attachedIds(joins: readonly Labelable[], kind: NotableKind): number[] {
        return joins
            .filter((join) => join.labelId === this.id && join.kind === kind)
            .map((join) => join.recordId);
    }
}
