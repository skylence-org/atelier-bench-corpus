/**
 * One technician's day, summarised.
 *
 * Import-precision site: `board` is a namespace object holding every export of
 * `./slotBoard.js`, and exactly one of them (`board.SlotBoard`) is ever read
 * here. The other three imports each carry an edge of their own: a default
 * binding renamed at the import site, a tagged template called without
 * parentheses, and a name that reaches this file through a glob re-export
 * rather than from the module that declares it.
 */

import * as board from "./slotBoard.js";
import DayWindow from "./slotWindow.js";
import { refTag } from "./referenceTag.js";
import { atelierFormatReference } from "./helpersGlob.js";

/** Prefix stamped on a technician's day reference. */
export const BOARD_REF_PREFIX = "TB";

/**
 * What a caller gets back for one technician-day.
 *
 * @typedef {object} DaySummary
 * @property {string} reference
 * @property {string} caption
 * @property {number} load
 * @property {string} window
 * @property {number} windowLength
 */

/**
 * Build the summary for one technician's booked slots.
 *
 * @param {string} technicianName
 * @param {number} technicianNumber
 * @param {number} capacity
 * @param {readonly number[]} slots
 * @returns {DaySummary}
 */
export function summariseDay(technicianName, technicianNumber, capacity, slots) {
    const day = new board.SlotBoard(technicianName, capacity, slots);
    const first = day.booked.length === 0 ? 0 : day.booked[0];
    const span = new DayWindow(first, day.booked.length);
    const reference = atelierFormatReference(BOARD_REF_PREFIX, technicianNumber);

    return {
        reference,
        caption: refTag`board ${reference} holds ${day.booked.length} of ${capacity}`,
        load: day.load,
        window: `${span}`,
        windowLength: Number(span),
    };
}
