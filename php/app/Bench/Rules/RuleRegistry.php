<?php

namespace App\Bench\Rules;

/**
 * Single fan-in site for all 48 RuleContract implementors.
 */
final class RuleRegistry
{
    public const array RULES = [
        MinimumStockRule::class,
        MaximumBacklogRule::class,
        WarrantyWindowRule::class,
        RushSurchargeRule::class,
        TechnicianCapacityRule::class,
        PartAvailabilityRule::class,
        InvoiceBalanceRule::class,
        CustomerCreditRule::class,
        DeviceAgeRule::class,
        RepairDurationRule::class,
        ReworkLimitRule::class,
        DiscountCeilingRule::class,
        DepositRequiredRule::class,
        LabelPresenceRule::class,
        NoteRequiredRule::class,
        SignatureRequiredRule::class,
        PriorityEscalationRule::class,
        StatusSequenceRule::class,
        PartCostMarginRule::class,
        RevenueFloorRule::class,
        GrossProfitRule::class,
        ScheduleGapRule::class,
        SlotOverbookingRule::class,
        IdleTechnicianRule::class,
        DuplicateReferenceRule::class,
        ReferencePrefixRule::class,
        CurrencyConsistencyRule::class,
        RoundingRule::class,
        TaxAppliedRule::class,
        ExportFreshnessRule::class,
        NotificationSentRule::class,
        AuditTrailRule::class,
        CacheTtlRule::class,
        ReportCoverageRule::class,
        MetricRangeRule::class,
        DatasetIntegrityRule::class,
        SeedDeterminismRule::class,
        OrderCountRule::class,
        CustomerCountRule::class,
        PartCountRule::class,
        InvoiceCountRule::class,
        OpenOrderRatioRule::class,
        CompletionRateRule::class,
        AverageTicketRule::class,
        PartsPerOrderRule::class,
        RepeatCustomerRule::class,
        DeviceCategoryRule::class,
        InventoryTurnoverRule::class,
    ];
}
