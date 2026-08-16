//! Model observers.

use crate::models::device::Device;

/// Lifecycle hooks for [`Device`]; the app registers one implementor.
pub trait DeviceObserver: Send + Sync {
    fn created(&self, device: &Device);

    fn updated(&self, _device: &Device) {}

    fn deleted(&self, _device: &Device) {}
}

/// Writes an audit line whenever a device appears.
#[derive(Debug, Default)]
pub struct AuditingDeviceObserver {
    pub lines: std::sync::Mutex<Vec<String>>,
}

impl DeviceObserver for AuditingDeviceObserver {
    fn created(&self, device: &Device) {
        if let Ok(mut lines) = self.lines.lock() {
            lines.push(format!("device.created {}", device.label()));
        }
    }

    fn deleted(&self, device: &Device) {
        if let Ok(mut lines) = self.lines.lock() {
            lines.push(format!("device.deleted {}", device.label()));
        }
    }
}
