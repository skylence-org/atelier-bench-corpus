/**
 * Registry of every RuleContract implementor in the lane: 24 nominal
 * (`implements RuleContract`, one class per file) and 24 structural (object
 * literals, no `implements` keyword anywhere -- 16 typed `: RuleContract`,
 * 8 checked via `satisfies RuleContract`).
 */

import { MinimumStockRule } from "./minimumStockRule";
import { MaximumBacklogRule } from "./maximumBacklogRule";
import { WarrantyWindowRule } from "./warrantyWindowRule";
import { RushSurchargeRule } from "./rushSurchargeRule";
import { TechnicianCapacityRule } from "./technicianCapacityRule";
import { PartAvailabilityRule } from "./partAvailabilityRule";
import { InvoiceBalanceRule } from "./invoiceBalanceRule";
import { CustomerCreditRule } from "./customerCreditRule";
import { DeviceAgeRule } from "./deviceAgeRule";
import { RepairDurationRule } from "./repairDurationRule";
import { ReworkLimitRule } from "./reworkLimitRule";
import { DiscountCeilingRule } from "./discountCeilingRule";
import { DepositRequiredRule } from "./depositRequiredRule";
import { LabelPresenceRule } from "./labelPresenceRule";
import { NoteRequiredRule } from "./noteRequiredRule";
import { SignatureRequiredRule } from "./signatureRequiredRule";
import { PriorityEscalationRule } from "./priorityEscalationRule";
import { StatusSequenceRule } from "./statusSequenceRule";
import { PartCostMarginRule } from "./partCostMarginRule";
import { RevenueFloorRule } from "./revenueFloorRule";
import { GrossProfitRule } from "./grossProfitRule";
import { ScheduleGapRule } from "./scheduleGapRule";
import { SlotOverbookingRule } from "./slotOverbookingRule";
import { IdleTechnicianRule } from "./idleTechnicianRule";
import { duplicateReferenceRule } from "./duplicateReferenceRule";
import { referencePrefixRule } from "./referencePrefixRule";
import { currencyConsistencyRule } from "./currencyConsistencyRule";
import { roundingRule } from "./roundingRule";
import { taxAppliedRule } from "./taxAppliedRule";
import { exportFreshnessRule } from "./exportFreshnessRule";
import { notificationSentRule } from "./notificationSentRule";
import { auditTrailRule } from "./auditTrailRule";
import { cacheTtlRule } from "./cacheTtlRule";
import { reportCoverageRule } from "./reportCoverageRule";
import { metricRangeRule } from "./metricRangeRule";
import { datasetIntegrityRule } from "./datasetIntegrityRule";
import { seedDeterminismRule } from "./seedDeterminismRule";
import { orderCountRule } from "./orderCountRule";
import { customerCountRule } from "./customerCountRule";
import { partCountRule } from "./partCountRule";
import { invoiceCountRule } from "./invoiceCountRule";
import { openOrderRatioRule } from "./openOrderRatioRule";
import { completionRateRule } from "./completionRateRule";
import { averageTicketRule } from "./averageTicketRule";
import { partsPerOrderRule } from "./partsPerOrderRule";
import { repeatCustomerRule } from "./repeatCustomerRule";
import { deviceCategoryRule } from "./deviceCategoryRule";
import { inventoryTurnoverRule } from "./inventoryTurnoverRule";
import type { RuleContract } from "../contracts/ruleContract";

export const RULES: readonly RuleContract[] = [
    new MinimumStockRule(),
    new MaximumBacklogRule(),
    new WarrantyWindowRule(),
    new RushSurchargeRule(),
    new TechnicianCapacityRule(),
    new PartAvailabilityRule(),
    new InvoiceBalanceRule(),
    new CustomerCreditRule(),
    new DeviceAgeRule(),
    new RepairDurationRule(),
    new ReworkLimitRule(),
    new DiscountCeilingRule(),
    new DepositRequiredRule(),
    new LabelPresenceRule(),
    new NoteRequiredRule(),
    new SignatureRequiredRule(),
    new PriorityEscalationRule(),
    new StatusSequenceRule(),
    new PartCostMarginRule(),
    new RevenueFloorRule(),
    new GrossProfitRule(),
    new ScheduleGapRule(),
    new SlotOverbookingRule(),
    new IdleTechnicianRule(),
    duplicateReferenceRule,
    referencePrefixRule,
    currencyConsistencyRule,
    roundingRule,
    taxAppliedRule,
    exportFreshnessRule,
    notificationSentRule,
    auditTrailRule,
    cacheTtlRule,
    reportCoverageRule,
    metricRangeRule,
    datasetIntegrityRule,
    seedDeterminismRule,
    orderCountRule,
    customerCountRule,
    partCountRule,
    invoiceCountRule,
    openOrderRatioRule,
    completionRateRule,
    averageTicketRule,
    partsPerOrderRule,
    repeatCustomerRule,
    deviceCategoryRule,
    inventoryTurnoverRule,
];
