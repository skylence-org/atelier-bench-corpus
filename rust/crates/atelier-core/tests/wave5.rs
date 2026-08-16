//! Build-script, #[path], lifetime/HRTB and GAT surfaces behave.

use atelier_core::support::borrowed::{Borrowed, apply_all, label_widths};
use atelier_core::support::generated_units::{
    GENERATED_UNIT_COUNT, generated_units, unit_label_count,
};
use atelier_core::support::ledger::{LedgerLine, ledger_lines};
use atelier_core::support::lender::{LabelStore, Lender, first_label};

#[test]
fn build_script_generates_the_units_module() {
    assert_eq!(generated_units(), ["piece", "hour", "gram", "metre"]);
    assert_eq!(GENERATED_UNIT_COUNT, 4);
    assert_eq!(unit_label_count(), 4);
}

#[test]
fn path_attribute_module_resolves_to_the_pathed_file() {
    assert_eq!(ledger_lines(), 12);
    let line = LedgerLine {
        day: 1,
        cents: 4_500,
    };
    assert_eq!(
        line,
        LedgerLine {
            day: 1,
            cents: 4_500
        }
    );
}

#[test]
fn borrowed_view_and_hrtb_helper() {
    let owned = String::from("Screen 13\"");
    let view = Borrowed::new(&owned);
    assert_eq!(view.label(), "Screen 13\"");
    assert_eq!(apply_all(&["a", "bb"], str::len), vec![1, 2]);
    assert_eq!(label_widths(&["piece", "hour"]), vec![5, 4]);
}

#[test]
fn gat_lender_hands_out_the_first_label() {
    let store = LabelStore::new(vec!["gram".to_string(), "metre".to_string()]);
    assert_eq!(store.lend(), Some("gram"));
    assert_eq!(first_label(&store), Some("gram"));
    assert_eq!(LabelStore::default().lend(), None);
}
