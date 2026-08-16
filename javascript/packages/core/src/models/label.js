/** Many-to-many label attachable to several record kinds. */

/**
 * Join row: the analogue of a polymorphic pivot table.
 *
 * @typedef {object} Labelable
 * @property {number} labelId
 * @property {import("./note.js").NotableKindValue} kind
 * @property {number} recordId
 */

export class Label {
    /**
     * @param {number} id
     * @param {string} name
     * @param {string} [colour]
     */
    constructor(id, name, colour = "slate") {
        this.id = id;
        this.name = name;
        this.colour = colour;
    }

    /**
     * Records of `kind` carrying this label.
     *
     * @param {readonly Labelable[]} joins
     * @param {import("./note.js").NotableKindValue} kind
     * @returns {number[]}
     */
    attachedIds(joins, kind) {
        return joins
            .filter((join) => join.labelId === this.id && join.kind === kind)
            .map((join) => join.recordId);
    }
}
