// DO NOT FIX. Negative case for parsers and indexers.
//
// The function body is never closed and the object literal below it is
// truncated mid-property: a parser must report an error here, not a partial
// tree with an invented closing brace.

export function scheduleRepair(order, technician) {
    const slot = technician.nextSlot();

    if (slot === undefined) {
        return {
            ok: false,
            reason: "no slot",

    order.assignedTo = technician.id;

    return {
        ok: true,
        slot,
