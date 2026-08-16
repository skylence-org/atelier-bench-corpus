/** Polymorphic note attachable to several record kinds. */

/**
 * What a note can hang off.
 *
 * @typedef {"customer" | "device" | "repair_order" | "part"} NotableKindValue
 */

export const NotableKind = Object.freeze({
    Customer: /** @type {NotableKindValue} */ ("customer"),
    Device: /** @type {NotableKindValue} */ ("device"),
    RepairOrder: /** @type {NotableKindValue} */ ("repair_order"),
    Part: /** @type {NotableKindValue} */ ("part"),
});

export class Note {
    /**
     * @param {number} id
     * @param {NotableKindValue} notableKind
     * @param {number} notableId
     * @param {string} body
     * @param {string} [author]
     */
    constructor(id, notableKind, notableId, body, author = "system") {
        this.id = id;
        this.notableKind = notableKind;
        this.notableId = notableId;
        this.body = body;
        this.author = author;
    }

    /**
     * @param {number} width
     * @returns {string}
     */
    excerpt(width) {
        return this.body.length <= width ? this.body : `${this.body.slice(0, width - 1)}…`;
    }
}
