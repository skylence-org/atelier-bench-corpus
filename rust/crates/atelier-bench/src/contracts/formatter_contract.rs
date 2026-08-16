//! Number formatting shared by exporters and report footers.

pub trait FormatterContract {
    /// Render an exact cent amount.
    fn format_cents(&self, cents: i64) -> String;

    /// Render a 0.0-1.0 ratio as a percentage.
    fn format_percent(&self, ratio: f64) -> String {
        format!("{:.1}%", ratio * 100.0)
    }

    /// Render a plain count.
    fn format_count(&self, count: usize) -> String {
        count.to_string()
    }
}
