//! JSON rendering for anything `serde` can serialise.
//!
//! Second blanket impl in the lane, this one keyed on a *foreign* trait bound.

pub trait HasSerialization: serde::Serialize {
    fn to_json(&self) -> String {
        serde_json::to_string(self).unwrap_or_else(|_| "null".to_string())
    }

    fn to_pretty_json(&self) -> String {
        serde_json::to_string_pretty(self).unwrap_or_else(|_| "null".to_string())
    }
}

impl<T: serde::Serialize> HasSerialization for T {}
