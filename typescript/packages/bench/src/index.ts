/**
 * Breadth subsystem for the typescript lane.
 *
 * Deliberately wide and shallow: eight contracts, eight reusable concerns,
 * seven abstract bases and 76 small implementors. The point is fan-in and
 * fan-out -- one contract with two dozen implementors, one base reached from
 * every component -- not domain depth.
 */

import type { MetricContract } from "./contracts/metricContract";
import type { ReportContract } from "./contracts/reportContract";
import { CashFlowReport } from "./reports/cashFlowReport";
import { ChurnRiskReport } from "./reports/churnRiskReport";
import { CustomerLifetimeReport } from "./reports/customerLifetimeReport";
import { CustomerRetentionReport } from "./reports/customerRetentionReport";
import { DailyRevenueReport } from "./reports/dailyRevenueReport";
import { GrossProfitReport } from "./reports/grossProfitReport";
import { InventoryTurnoverReport } from "./reports/inventoryTurnoverReport";
import { MonthlyRevenueReport } from "./reports/monthlyRevenueReport";
import { NetMarginReport } from "./reports/netMarginReport";
import { OrderBacklogReport } from "./reports/orderBacklogReport";
import { OrderThroughputReport } from "./reports/orderThroughputReport";
import { OrderVolumeReport } from "./reports/orderVolumeReport";
import { PartShortageReport } from "./reports/partShortageReport";
import { PartUsageReport } from "./reports/partUsageReport";
import { PaymentDefaultReport } from "./reports/paymentDefaultReport";
import { PaymentLatencyReport } from "./reports/paymentLatencyReport";
import { ProfitMarginReport } from "./reports/profitMarginReport";
import { TechnicianEfficiencyReport } from "./reports/technicianEfficiencyReport";
import { TechnicianLoadReport } from "./reports/technicianLoadReport";
import { TechnicianPayrollReport } from "./reports/technicianPayrollReport";
import { WarrantyClaimReport } from "./reports/warrantyClaimReport";
import { WarrantyCostReport } from "./reports/warrantyCostReport";
import { WarrantyTrendReport } from "./reports/warrantyTrendReport";
import { WeeklyRevenueReport } from "./reports/weeklyRevenueReport";
import { AverageTicketMetric } from "./metrics/averageTicketMetric";
import { FirstFixRateMetric } from "./metrics/firstFixRateMetric";
import { InventoryAgeMetric } from "./metrics/inventoryAgeMetric";
import { LaborCostMetric } from "./metrics/laborCostMetric";
import { MarginMetric } from "./metrics/marginMetric";
import { NpsMetric } from "./metrics/npsMetric";
import { OrdersPerDayMetric } from "./metrics/ordersPerDayMetric";
import { OverheadMetric } from "./metrics/overheadMetric";
import { PartCostMetric } from "./metrics/partCostMetric";
import { PartsPerOrderMetric } from "./metrics/partsPerOrderMetric";
import { PaymentDelayMetric } from "./metrics/paymentDelayMetric";
import { RepeatCustomerMetric } from "./metrics/repeatCustomerMetric";
import { ReturnRateMetric } from "./metrics/returnRateMetric";
import { TechnicianUtilizationMetric } from "./metrics/technicianUtilizationMetric";
import { UpsellRateMetric } from "./metrics/upsellRateMetric";
import { WarrantyRateMetric } from "./metrics/warrantyRateMetric";

export { Dataset } from "./dataset";
export * from "./contracts/reportContract";
export * from "./contracts/metricContract";
export * from "./contracts/exporterContract";
export * from "./contracts/notifierContract";
export * from "./contracts/scheduleContract";
export * from "./contracts/ruleContract";
export { RULES } from "./rules";

/**
 * Every report in the lane, in registry order.
 *
 * The widest fan-in site in the corpus: a references request on
 * {@link ReportContract} must account for all 24 entries below.
 */
export const REPORTS: readonly ReportContract[] = [
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

/** Every metric in the lane, in registry order. */
export const METRICS: readonly MetricContract[] = [
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

/** Look a report up by its slug. */
export function report(slug: string): ReportContract | undefined {
    return REPORTS.find((candidate) => candidate.slug === slug);
}

/** Look a metric up by its key. */
export function metric(key: string): MetricContract | undefined {
    return METRICS.find((candidate) => candidate.key === key);
}
