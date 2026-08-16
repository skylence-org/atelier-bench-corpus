/**
 * Barrel for the domain core.
 *
 * Every name below is re-exported, never declared here: a definition lookup
 * must follow the barrel to the declaring module, not stop on this file. The
 * package `exports` map in `../package.json` adds the `./billing`,
 * `./reporting`, `./support/*`, `./concerns/*` and `./models/*` subpaths.
 */

export { Reference } from "./support/reference.js";
export {
    ATELIER_REF_PREFIX,
    ATELIER_REF_WIDTH,
    atelierFormatReference,
    atelierParseReference,
} from "./support/helpers.js";
export { Schedule } from "./support/schedule.js";
export { RepairStatus } from "./support/status.js";
export { Priority } from "./support/priority.js";
export { TreeNode } from "./support/treeNode.js";

export { Money } from "./money.js";
export { AtelierError, IllegalTransitionError, NotFoundError, ValidationError } from "./errors.js";
export { Container } from "./container.js";

export { isInvoiceCalculator } from "./contracts/invoiceCalculator.js";
export { sizeOf } from "./contracts/repository.js";
export { StandardInvoiceCalculator } from "./services/standardInvoiceCalculator.js";
export { RushInvoiceCalculator } from "./services/rushInvoiceCalculator.js";

export { Customer } from "./models/customer.js";
export { Device, Laptop } from "./models/device.js";
export { Part } from "./models/part.js";
export { makeTechnician } from "./models/technician.js";
export { RepairOrder } from "./models/repairOrder.js";
export { Invoice } from "./models/invoice.js";
export { Note, NotableKind } from "./models/note.js";
export { Label } from "./models/label.js";
export { Signature } from "./models/signature.js";

export { hasReference, withReference } from "./concerns/hasReference.js";
export { forwardsToSchedule } from "./concerns/forwardsToSchedule.js";

export {
    Dispatcher,
    SendCompletionNotice,
    channelFor,
    REPAIR_COMPLETED,
    STATUS_CHANGED,
    STOCK_DEPLETED,
} from "./events.js";
export { AuditingDeviceObserver } from "./observers.js";
export { RepairOrderPolicy } from "./policy.js";

// Deliberately NOT re-exported: both halves of the same-name Formatter pair,
// and the Left/Right sibling pair. Consumers reach them through the subpath
// exports and alias them at the import site.
