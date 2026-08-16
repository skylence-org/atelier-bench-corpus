//! Both `Formatter` types are in scope at once, under aliases.

use atelier_core::billing::Formatter as MoneyFormatter;
use atelier_core::money::Money;
use atelier_core::reporting::Formatter as StatusFormatter;
use atelier_core::support::status::RepairStatus;

#[test]
fn billing_formatter_renders_money() {
    let money = MoneyFormatter::new("EUR");

    assert_eq!(money.money(Money(1_234), ""), "12.34 EUR");
}

#[test]
fn reporting_formatter_renders_status() {
    let status = StatusFormatter::new("en");

    assert_eq!(
        status.status_line(RepairStatus::AwaitingParts, Some("Monday")),
        "Awaiting parts since Monday"
    );
}
