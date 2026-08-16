/**
 * Structural half of the rule registry.
 *
 * Twenty-four object literals, no class and no name binding anywhere: each one
 * satisfies the rule contract by shape alone. The nominal half lives in the
 * sibling files, one class per key.
 */

/** @type {readonly import("../contracts/ruleContract.cjs").RuleContract[]} */
const STRUCTURAL_RULES = [
    {
        /** No two orders share a reference. (DuplicateReferenceRule) */
        key: "duplicate-reference",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return new Set(data.orders.map((order) => order.reference())).size === data.orders.length;
        },
    },
    {
        /** Every order reference carries the atelier prefix. (ReferencePrefixRule) */
        key: "reference-prefix",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.orders.every((order) => order.reference().startsWith("AT-"));
        },
    },
    {
        /** Every amount is an integer cent value. (CurrencyConsistencyRule) */
        key: "currency-consistency",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.invoices.every((invoice) => Number.isInteger(invoice.total.cents));
        },
    },
    {
        /** Part cost needs no rounding. (RoundingRule) */
        key: "rounding",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.partsCostCents() % 1 === 0;
        },
    },
    {
        /** Revenue exceeds part cost, so tax has something to sit on. (TaxAppliedRule) */
        key: "tax-applied",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.revenueCents() > data.partsCostCents();
        },
    },
    {
        /** There is something to export. (ExportFreshnessRule) */
        key: "export-freshness",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.orders.length > 0;
        },
    },
    {
        /** A completion notice had a trigger. (NotificationSentRule) */
        key: "notification-sent",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.completedOrders().length > 0;
        },
    },
    {
        /** At least one order kept a lifecycle log. (AuditTrailRule) */
        key: "audit-trail",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.orders.some((order) => order.log.length > 0);
        },
    },
    {
        /** The catalogue is worth caching. (CacheTtlRule) */
        key: "cache-ttl",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.parts.length > 0;
        },
    },
    {
        /** Reports have customers to cover. (ReportCoverageRule) */
        key: "report-coverage",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.customers.length > 0;
        },
    },
    {
        /** Labour minutes never go negative. (MetricRangeRule) */
        key: "metric-range",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.labourMinutes() >= 0;
        },
    },
    {
        /** One device per customer in the seed. (DatasetIntegrityRule) */
        key: "dataset-integrity",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.devices.length === data.customers.length;
        },
    },
    {
        /** Revenue is the frozen number. (SeedDeterminismRule) */
        key: "seed-determinism",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.revenueCents() === 58325;
        },
    },
    {
        /** Four seeded orders. (OrderCountRule) */
        key: "order-count",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.orders.length === 4;
        },
    },
    {
        /** Three seeded customers. (CustomerCountRule) */
        key: "customer-count",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.customers.length === 3;
        },
    },
    {
        /** Four seeded parts. (PartCountRule) */
        key: "part-count",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.parts.length === 4;
        },
    },
    {
        /** Two seeded invoices. (InvoiceCountRule) */
        key: "invoice-count",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.invoices.length === 2;
        },
    },
    {
        /** The open share never exceeds the whole. (OpenOrderRatioRule) */
        key: "open-order-ratio",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.openOrders().length / data.orders.length <= 1;
        },
    },
    {
        /** At least a quarter of the book is done. (CompletionRateRule) */
        key: "completion-rate",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.completedOrders().length / data.orders.length >= 0.25;
        },
    },
    {
        /** The mean ticket is positive. (AverageTicketRule) */
        key: "average-ticket",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.revenueCents() / data.orders.length > 0;
        },
    },
    {
        /** Four part lines across the book. (PartsPerOrderRule) */
        key: "parts-per-order",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.orders.reduce((total, order) => total + order.parts.length, 0) >= 4;
        },
    },
    {
        /** Someone came back. (RepeatCustomerRule) */
        key: "repeat-customer",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.customers.some((customer) => data.ordersFor(customer.id).length > 1);
        },
    },
    {
        /** Every device names a brand. (DeviceCategoryRule) */
        key: "device-category",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.devices.every((device) => device.brand.length > 0);
        },
    },
    {
        /** Consumption is never negative. (InventoryTurnoverRule) */
        key: "inventory-turnover",

        /**
         * @param {import("../dataset.cjs").Dataset} data
         * @returns {boolean}
         */
        evaluate(data) {
            return data.parts.some((part) => part.consumedQuantity() >= 0);
        },
    },
];

module.exports = { STRUCTURAL_RULES };
