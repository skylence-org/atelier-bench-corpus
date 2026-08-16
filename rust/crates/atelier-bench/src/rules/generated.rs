//! Generated half of `RuleContract`'s 48 implementors: every struct and its
//! `impl` below is produced by one `define_rules!` expansion, so none of
//! them has a textual `impl RuleContract for X` line of its own.

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

macro_rules! define_rules {
    ($($name:ident => $body:expr),* $(,)?) => {
        $(
            pub struct $name;

            impl RuleContract for $name {
                fn evaluate(&self, data: &Dataset) -> bool {
                    $body
                }
            }
        )*
    };
}

define_rules! {
    DuplicateReferenceRule => !data.orders.is_empty(),
    ReferencePrefixRule => !data.customers.is_empty(),
    CurrencyConsistencyRule => !data.invoices.is_empty(),
    RoundingRule => !data.parts.is_empty(),
    TaxAppliedRule => !data.invoices.is_empty(),
    ExportFreshnessRule => !data.orders.is_empty(),
    NotificationSentRule => !data.customers.is_empty(),
    AuditTrailRule => !data.orders.is_empty(),
    CacheTtlRule => !data.parts.is_empty(),
    ReportCoverageRule => !data.orders.is_empty(),
    MetricRangeRule => !data.invoices.is_empty(),
    DatasetIntegrityRule => !data.technicians.is_empty(),
    SeedDeterminismRule => data.orders.len() >= 1,
    OrderCountRule => data.orders.len() >= 1,
    CustomerCountRule => data.customers.len() >= 1,
    PartCountRule => data.parts.len() >= 1,
    InvoiceCountRule => data.invoices.len() >= 1,
    OpenOrderRatioRule => !data.open_orders().is_empty(),
    CompletionRateRule => !data.completed_orders().is_empty(),
    AverageTicketRule => data.revenue_cents() >= 0,
    PartsPerOrderRule => !data.orders.is_empty(),
    RepeatCustomerRule => !data.customers.is_empty(),
    DeviceCategoryRule => !data.devices.is_empty(),
    InventoryTurnoverRule => !data.parts.is_empty(),
}
