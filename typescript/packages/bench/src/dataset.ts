/**
 * Deterministic in-memory dataset.
 *
 * Fixed rows, no randomness: every lane of this corpus must produce identical
 * numbers so bench expectations can be hard-coded.
 */

import {
    Customer,
    Device,
    Invoice,
    makeTechnician,
    Money,
    Part,
    Priority,
    RepairOrder,
    RepairStatus,
    type Technician,
} from "@atelier/core";

/** Everything a report, metric or service reads from. */
export class Dataset {
    private constructor(
        readonly customers: readonly Customer[],
        readonly devices: readonly Device[],
        readonly orders: readonly RepairOrder[],
        readonly parts: readonly Part[],
        readonly technicians: readonly Technician[],
        readonly invoices: readonly Invoice[],
    ) {}

    /** The frozen seed. Changing these rows changes bench ground truth. */
    static seeded(): Dataset {
        const customers = [
            Customer.seed(1, "Ada Byron", "ada@example.test", "+32 470 00 00 01"),
            Customer.seed(2, "Grace Hopper", "grace@example.test"),
            Customer.seed(3, "Alan Turing", "alan@example.test", "+32 470 00 00 03"),
        ];

        const devices = [
            new Device(1, 1, "Framework", "13", "SER-0001"),
            new Device(2, 2, "Lenovo", "X1", "SER-0002"),
            new Device(3, 3, "Apple", "MBP 14"),
        ];

        const parts = [
            new Part(1, "SCR-13", 'Screen 13"', new Money(19900), 4),
            new Part(2, "BAT-55", "Battery 55Wh", new Money(8900), 1),
            new Part(3, "KBD-EU", "Keyboard EU", new Money(6400), 7),
            new Part(4, "FAN-A1", "Cooling fan", new Money(2200), 2),
        ];

        const technicians = [makeTechnician(1, "Nel"), makeTechnician(2, "Rik"), makeTechnician(3, "Sam")];

        const orders = [
            RepairOrder.seed(1, 1, 1),
            RepairOrder.seed(2, 2, 2),
            RepairOrder.seed(3, 3, 3),
            RepairOrder.seed(4, 1, 1),
        ];

        orders[0]!.laborMinutes = 120;
        orders[0]!.addPart(parts[0]!, 1);
        orders[0]!.transitionTo(RepairStatus.Diagnosing, "seeder");
        orders[0]!.transitionTo(RepairStatus.Repairing, "seeder");
        orders[0]!.transitionTo(RepairStatus.Completed, "seeder");

        orders[1]!.laborMinutes = 45;
        orders[1]!.priority = Priority.Rush;
        orders[1]!.addPart(parts[1]!, 2);
        orders[1]!.transitionTo(RepairStatus.Diagnosing, "seeder");
        orders[1]!.transitionTo(RepairStatus.AwaitingParts, "seeder");

        orders[2]!.laborMinutes = 90;
        orders[2]!.priority = Priority.Warranty;
        orders[2]!.addPart(parts[2]!, 1);
        orders[2]!.addPart(parts[3]!, 1);
        orders[2]!.transitionTo(RepairStatus.Diagnosing, "seeder");
        orders[2]!.transitionTo(RepairStatus.Repairing, "seeder");

        orders[3]!.laborMinutes = 30;

        const invoices = [new Invoice(1, 1, new Money(34900)), new Invoice(2, 2, new Money(23425))];

        return new Dataset(customers, devices, orders, parts, technicians, invoices);
    }

    /** Orders that have reached a billable end state. */
    completedOrders(): readonly RepairOrder[] {
        return this.orders.filter((order) => !order.isOpen());
    }

    /** Orders still occupying bench space. */
    openOrders(): readonly RepairOrder[] {
        return this.orders.filter((order) => order.isOpen());
    }

    ordersFor(customerId: number): readonly RepairOrder[] {
        return this.orders.filter((order) => order.customerId === customerId);
    }

    part(sku: string): Part | undefined {
        return this.parts.find((part) => part.sku === sku);
    }

    lowStockParts(): readonly Part[] {
        return this.parts.filter((part) => part.isLowStock());
    }

    /** Sum of every issued invoice, in cents. */
    revenueCents(): number {
        return this.invoices.reduce((total, invoice) => total + invoice.total.cents, 0);
    }

    /** Sum of every part line across every order, in cents. */
    partsCostCents(): number {
        return this.orders.reduce((total, order) => total + order.partsSubtotal().cents, 0);
    }

    labourMinutes(): number {
        return this.orders.reduce((total, order) => total + order.laborMinutes, 0);
    }
}
