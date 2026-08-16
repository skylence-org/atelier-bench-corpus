//! Log-line prefixing.

pub trait HasLogging {
    /// Target segment written in front of every line.
    fn log_target(&self) -> &'static str;

    fn log_line(&self, message: &str) -> String {
        format!("[{}] {message}", self.log_target())
    }
}
