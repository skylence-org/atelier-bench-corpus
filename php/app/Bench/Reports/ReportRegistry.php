<?php

namespace App\Bench\Reports;

/**
 * Single fan-in site for all 24 ReportContract implementors, mirroring
 * App\Bench\Rules\RuleRegistry for reports.
 */
final class ReportRegistry
{
    /** @var list<class-string<\App\Bench\Contracts\ReportContract>> */
    public const array REPORTS = [
        CashFlowReport::class,
        ChurnRiskReport::class,
        CustomerLifetimeReport::class,
        CustomerRetentionReport::class,
        DailyRevenueReport::class,
        GrossProfitReport::class,
        InventoryTurnoverReport::class,
        MonthlyRevenueReport::class,
        NetMarginReport::class,
        OrderBacklogReport::class,
        OrderThroughputReport::class,
        OrderVolumeReport::class,
        PartShortageReport::class,
        PartUsageReport::class,
        PaymentDefaultReport::class,
        PaymentLatencyReport::class,
        ProfitMarginReport::class,
        TechnicianEfficiencyReport::class,
        TechnicianLoadReport::class,
        TechnicianPayrollReport::class,
        WarrantyClaimReport::class,
        WarrantyCostReport::class,
        WarrantyTrendReport::class,
        WeeklyRevenueReport::class,
    ];

    /** @return list<class-string<\App\Bench\Contracts\ReportContract>> */
    public static function all(): array
    {
        return self::REPORTS;
    }

    public static function count(): int
    {
        return count(self::REPORTS);
    }
}
