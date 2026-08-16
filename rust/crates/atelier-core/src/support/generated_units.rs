//! Build-script surface: the items in this module are written by `build.rs`
//! into `OUT_DIR` and spliced in here. `generated_units()` and
//! `GENERATED_UNIT_COUNT` have no textual definition under `src/`.

include!(concat!(env!("OUT_DIR"), "/generated_units.rs"));

/// Consumer of the generated function: the only call site under `src/`.
pub fn unit_label_count() -> usize {
    generated_units().len()
}
