/**
 * Barrel for the domain core.
 *
 * Every name below is re-exported, never declared here: a definition lookup
 * must follow the barrel to the declaring module, not stop on this file.
 */

export { Reference } from "./support/reference";
export {
    ATELIER_REF_PREFIX,
    ATELIER_REF_WIDTH,
    atelierFormatReference,
    atelierParseReference,
} from "./support/helpers";
export { Schedule } from "./support/schedule";
export { RepairStatus } from "./support/status";
export { Priority } from "./support/priority";

export { Money } from "./money";
export { AtelierError, IllegalTransitionError, NotFoundError, ValidationError } from "./errors";
export { Container } from "./container";

export type { InvoiceCalculator } from "./contracts/invoiceCalculator";
export type { Repository } from "./contracts/repository";
export { StandardInvoiceCalculator } from "./services/standardInvoiceCalculator";
export { RushInvoiceCalculator } from "./services/rushInvoiceCalculator";

export { Customer } from "./models/customer";
export { Device } from "./models/device";
export { Part } from "./models/part";
export type { Technician } from "./models/technician";
export { makeTechnician } from "./models/technician";
export { RepairOrder } from "./models/repairOrder";
export { Invoice } from "./models/invoice";
export { Note, NotableKind } from "./models/note";
export { Label } from "./models/label";
export { Signature } from "./models/signature";

export { Dispatcher, SendCompletionNotice, channelFor } from "./events";
export type { DomainEvent, Listener } from "./events";
export { AuditingDeviceObserver } from "./observers";
export type { DeviceObserver } from "./observers";
export { RepairOrderPolicy } from "./policy";
export type { Actor } from "./policy";

// Deliberately NOT re-exported: both halves of the same-name pair. Consumers
// import them through the "./billing" and "./reporting" subpath exports and
// alias them at the import site.
