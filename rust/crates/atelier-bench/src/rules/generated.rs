//! Generated half of `RuleContract`'s 48 implementors: every struct and its
//! `impl` below is produced by one `define_rules!` expansion, so none of
//! them has a textual `impl RuleContract for X` line of its own.

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

macro_rules! define_rules {
    ($($name:ident => |$data:ident| $body:expr),* $(,)?) => {
        $(
            pub struct $name;

            impl RuleContract for $name {
                fn evaluate(&self, $data: &Dataset) -> bool {
                    $body
                }
            }
        )*
    };
}

define_rules! {
    DuplicateReferenceRule => |data| !data.orders.is_empty(),
    ReferencePrefixRule => |data| !data.customers.is_empty(),
    CurrencyConsistencyRule => |data| !data.invoices.is_empty(),
    RoundingRule => |data| !data.parts.is_empty(),
    TaxAppliedRule => |data| !data.invoices.is_empty(),
    ExportFreshnessRule => |data| !data.orders.is_empty(),
    NotificationSentRule => |data| !data.customers.is_empty(),
    AuditTrailRule => |data| !data.orders.is_empty(),
    CacheTtlRule => |data| !data.parts.is_empty(),
    ReportCoverageRule => |data| !data.orders.is_empty(),
    MetricRangeRule => |data| !data.invoices.is_empty(),
    DatasetIntegrityRule => |data| !data.technicians.is_empty(),
    SeedDeterminismRule => |data| data.orders.len() >= 1,
    OrderCountRule => |data| data.orders.len() >= 1,
    CustomerCountRule => |data| data.customers.len() >= 1,
    PartCountRule => |data| data.parts.len() >= 1,
    InvoiceCountRule => |data| data.invoices.len() >= 1,
    OpenOrderRatioRule => |data| !data.open_orders().is_empty(),
    CompletionRateRule => |data| !data.completed_orders().is_empty(),
    AverageTicketRule => |data| data.revenue_cents() >= 0,
    PartsPerOrderRule => |data| !data.orders.is_empty(),
    RepeatCustomerRule => |data| !data.customers.is_empty(),
    DeviceCategoryRule => |data| !data.devices.is_empty(),
    InventoryTurnoverRule => |data| !data.parts.is_empty(),
}
