/**
 * Breadth subsystem for the javascript lane.
 *
 * Deliberately wide and shallow: ten contracts, eight reusable concerns, eight
 * bases and 124 small implementors. The point is fan-in and fan-out -- one
 * contract with two dozen implementors, another with forty-eight -- not domain
 * depth.
 *
 * Two registries live here on purpose. `REPORTS` is static: every report file
 * is required by name, so the edges are visible to a parser. `loadReport` is
 * dynamic: it builds the path from a slug at call time, which no static
 * analysis can resolve to one file. Both reach the same 24 modules.
 */

const { Dataset } = require("./dataset.cjs");
const { reportRow, rowFromCents } = require("./reportContract.cjs");
const { NotifyError } = require("./contracts/notifierContract.cjs");
const { MetricUnit, suffix } = require("./contracts/metricContract.cjs");
const { Cadence } = require("./contracts/scheduleContract.cjs");
const { CompositeContract } = require("./contracts/compositeContract.cjs");
const { isRuleContract } = require("./contracts/ruleContract.cjs");
const { RULES, RuleRegistry } = require("./rules/index.cjs");

const CashFlowReport = require("./reports/cash-flow.cjs");
const ChurnRiskReport = require("./reports/churn-risk.cjs");
const CustomerLifetimeReport = require("./reports/customer-lifetime.cjs");
const CustomerRetentionReport = require("./reports/customer-retention.cjs");
const DailyRevenueReport = require("./reports/daily-revenue.cjs");
const GrossProfitReport = require("./reports/gross-profit.cjs");
const InventoryTurnoverReport = require("./reports/inventory-turnover.cjs");
const MonthlyRevenueReport = require("./reports/monthly-revenue.cjs");
const NetMarginReport = require("./reports/net-margin.cjs");
const OrderBacklogReport = require("./reports/order-backlog.cjs");
const OrderThroughputReport = require("./reports/order-throughput.cjs");
const OrderVolumeReport = require("./reports/order-volume.cjs");
const PartShortageReport = require("./reports/part-shortage.cjs");
const PartUsageReport = require("./reports/part-usage.cjs");
const PaymentDefaultReport = require("./reports/payment-default.cjs");
const PaymentLatencyReport = require("./reports/payment-latency.cjs");
const ProfitMarginReport = require("./reports/profit-margin.cjs");
const TechnicianEfficiencyReport = require("./reports/technician-efficiency.cjs");
const TechnicianLoadReport = require("./reports/technician-load.cjs");
const TechnicianPayrollReport = require("./reports/technician-payroll.cjs");
const WarrantyClaimReport = require("./reports/warranty-claim.cjs");
const WarrantyCostReport = require("./reports/warranty-cost.cjs");
const WarrantyTrendReport = require("./reports/warranty-trend.cjs");
const WeeklyRevenueReport = require("./reports/weekly-revenue.cjs");

const { AverageTicketMetric } = require("./metrics/averageTicketMetric.cjs");
const { FirstFixRateMetric } = require("./metrics/firstFixRateMetric.cjs");
const { InventoryAgeMetric } = require("./metrics/inventoryAgeMetric.cjs");
const { LaborCostMetric } = require("./metrics/laborCostMetric.cjs");
const { MarginMetric } = require("./metrics/marginMetric.cjs");
const { NpsMetric } = require("./metrics/npsMetric.cjs");
const { OrdersPerDayMetric } = require("./metrics/ordersPerDayMetric.cjs");
const { OverheadMetric } = require("./metrics/overheadMetric.cjs");
const { PartCostMetric } = require("./metrics/partCostMetric.cjs");
const { PartsPerOrderMetric } = require("./metrics/partsPerOrderMetric.cjs");
const { PaymentDelayMetric } = require("./metrics/paymentDelayMetric.cjs");
const { RepeatCustomerMetric } = require("./metrics/repeatCustomerMetric.cjs");
const { ReturnRateMetric } = require("./metrics/returnRateMetric.cjs");
const { TechnicianUtilizationMetric } = require("./metrics/technicianUtilizationMetric.cjs");
const { UpsellRateMetric } = require("./metrics/upsellRateMetric.cjs");
const { WarrantyRateMetric } = require("./metrics/warrantyRateMetric.cjs");

/**
 * Every report in the lane, in registry order.
 *
 * The widest fan-in site in the corpus: a references request on the report
 * contract must account for all 24 entries below.
 *
 * @type {readonly import("./contracts/reportContract.cjs").ReportContract[]}
 */
const REPORTS = [
    new CashFlowReport(),
    new ChurnRiskReport(),
    new CustomerLifetimeReport(),
    new CustomerRetentionReport(),
    new DailyRevenueReport(),
    new GrossProfitReport(),
    new InventoryTurnoverReport(),
    new MonthlyRevenueReport(),
    new NetMarginReport(),
    new OrderBacklogReport(),
    new OrderThroughputReport(),
    new OrderVolumeReport(),
    new PartShortageReport(),
    new PartUsageReport(),
    new PaymentDefaultReport(),
    new PaymentLatencyReport(),
    new ProfitMarginReport(),
    new TechnicianEfficiencyReport(),
    new TechnicianLoadReport(),
    new TechnicianPayrollReport(),
    new WarrantyClaimReport(),
    new WarrantyCostReport(),
    new WarrantyTrendReport(),
    new WeeklyRevenueReport(),
];

/**
 * Every metric in the lane, in registry order.
 *
 * @type {readonly import("./contracts/metricContract.cjs").MetricContract[]}
 */
const METRICS = [
    new AverageTicketMetric(),
    new FirstFixRateMetric(),
    new InventoryAgeMetric(),
    new LaborCostMetric(),
    new MarginMetric(),
    new NpsMetric(),
    new OrdersPerDayMetric(),
    new OverheadMetric(),
    new PartCostMetric(),
    new PartsPerOrderMetric(),
    new PaymentDelayMetric(),
    new RepeatCustomerMetric(),
    new ReturnRateMetric(),
    new TechnicianUtilizationMetric(),
    new UpsellRateMetric(),
    new WarrantyRateMetric(),
];

/** Slugs of the 24 report modules; each one is also the file's basename. */
const REPORT_SLUGS = REPORTS.map((entry) => entry.slug);

/**
 * Load a report class by slug, resolving the module path at call time.
 *
 * Statically unresolvable on purpose: the argument decides the file, so the
 * only honest answer is the list of 24 candidates under `./reports/`.
 *
 * @param {string} slug
 * @returns {Function | undefined}
 */
function loadReport(slug) {
    if (!REPORT_SLUGS.includes(slug)) {
        return undefined;
    }

    return require(`./reports/${slug}.cjs`);
}

/**
 * Look a report up by its slug, through the static registry.
 *
 * @param {string} slug
 * @returns {import("./contracts/reportContract.cjs").ReportContract | undefined}
 */
function report(slug) {
    return REPORTS.find((candidate) => candidate.slug === slug);
}

/**
 * Look a metric up by its key.
 *
 * @param {string} key
 * @returns {import("./contracts/metricContract.cjs").MetricContract | undefined}
 */
function metric(key) {
    return METRICS.find((candidate) => candidate.key === key);
}

module.exports = {
    Cadence,
    CompositeContract,
    Dataset,
    METRICS,
    MetricUnit,
    NotifyError,
    REPORTS,
    REPORT_SLUGS,
    RULES,
    RuleRegistry,
    isRuleContract,
    loadReport,
    metric,
    report,
    reportRow,
    rowFromCents,
    suffix,
};
