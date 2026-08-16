/** Type guard and assertion function narrowing a RepairOrder by priority. */

import type { RepairOrder } from "../models/repairOrder";
import { Priority } from "./priority";

/** A RepairOrder narrowed to rush priority. */
export type RushOrder = RepairOrder & { priority: Priority.Rush };

/** Type guard: true only for rush-priority orders. */
export function isRush(order: RepairOrder): order is RushOrder {
    return order.priority === Priority.Rush;
}

/** Assertion function: throws unless the order is rush-priority. */
export function assertRush(order: RepairOrder): asserts order is RushOrder {
    if (!isRush(order)) {
        throw new TypeError("expected a rush-priority order");
    }
}
