/**
 * Deterministic in-memory dataset.
 *
 * Fixed rows, no randomness: every lane of this corpus must produce identical
 * numbers so bench expectations can be hard-coded.
 *
 * Two JavaScript edges live here. The whole domain arrives through
 * `require("@atelier/core")` even though that package is ESM, and the class is
 * iterable: `Symbol.iterator` is a generator, so `for (const order of data)`
 * walks the orders with nothing named `orders` at the call site.
 */

const {
    Customer,
    Device,
    Invoice,
    makeTechnician,
    Money,
    Part,
    Priority,
    RepairOrder,
    RepairStatus,
} = require("@atelier/core");

/** Everything a report, metric, service or rule reads from. */
class Dataset {
    /**
     * @param {readonly Customer[]} customers
     * @param {readonly Device[]} devices
     * @param {readonly RepairOrder[]} orders
     * @param {readonly Part[]} parts
     * @param {readonly object[]} technicians
     * @param {readonly Invoice[]} invoices
     */
    constructor(customers, devices, orders, parts, technicians, invoices) {
        this.customers = customers;
        this.devices = devices;
        this.orders = orders;
        this.parts = parts;
        this.technicians = technicians;
        this.invoices = invoices;
    }

    /**
     * The frozen seed. Changing these rows changes bench ground truth.
     *
     * @returns {Dataset}
     */
    static seeded() {
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

        orders[0].laborMinutes = 120;
        orders[0].addPart(parts[0], 1);
        orders[0].transitionTo(RepairStatus.Diagnosing, "seeder");
        orders[0].transitionTo(RepairStatus.Repairing, "seeder");
        orders[0].transitionTo(RepairStatus.Completed, "seeder");

        orders[1].laborMinutes = 45;
        orders[1].priority = Priority.Rush;
        orders[1].addPart(parts[1], 2);
        orders[1].transitionTo(RepairStatus.Diagnosing, "seeder");
        orders[1].transitionTo(RepairStatus.AwaitingParts, "seeder");

        orders[2].laborMinutes = 90;
        orders[2].priority = "warranty";
        orders[2].addPart(parts[2], 1);
        orders[2].addPart(parts[3], 1);
        orders[2].transitionTo(RepairStatus.Diagnosing, "seeder");
        orders[2].transitionTo(RepairStatus.Repairing, "seeder");

        orders[3].laborMinutes = 30;

        const invoices = [new Invoice(1, 1, new Money(34900)), new Invoice(2, 2, new Money(23425))];

        return new Dataset(customers, devices, orders, parts, technicians, invoices);
    }

    /**
     * Iterating a dataset iterates its orders.
     *
     * @returns {Generator<RepairOrder>}
     */
    *[Symbol.iterator]() {
        yield* this.orders;
    }

    /**
     * Lazily walk the orders of one customer.
     *
     * @param {number} customerId
     * @returns {Generator<RepairOrder>}
     */
    *ordersOf(customerId) {
        for (const order of this) {
            if (order.customerId === customerId) {
                yield order;
            }
        }
    }

    /**
     * Orders that have reached a billable end state.
     *
     * @returns {readonly RepairOrder[]}
     */
    completedOrders() {
        return this.orders.filter((order) => !order.isOpen());
    }

    /**
     * Orders still occupying bench space.
     *
     * @returns {readonly RepairOrder[]}
     */
    openOrders() {
        return this.orders.filter((order) => order.isOpen());
    }

    /**
     * @param {number} customerId
     * @returns {readonly RepairOrder[]}
     */
    ordersFor(customerId) {
        return [...this.ordersOf(customerId)];
    }

    /**
     * @param {string} sku
     * @returns {Part | undefined}
     */
    part(sku) {
        return this.parts.find((part) => part.sku === sku);
    }

    /** @returns {readonly Part[]} */
    lowStockParts() {
        return this.parts.filter((part) => part.isLowStock());
    }

    /**
     * Sum of every issued invoice, in cents.
     *
     * @returns {number}
     */
    revenueCents() {
        return this.invoices.reduce((total, invoice) => total + invoice.total.cents, 0);
    }

    /**
     * Sum of every part line across every order, in cents.
     *
     * @returns {number}
     */
    partsCostCents() {
        return this.orders.reduce((total, order) => total + order.partsSubtotal().cents, 0);
    }

    /** @returns {number} */
    labourMinutes() {
        return this.orders.reduce((total, order) => total + order.laborMinutes, 0);
    }
}

module.exports = { Dataset };
