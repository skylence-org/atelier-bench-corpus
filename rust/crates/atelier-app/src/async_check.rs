//! Native `async fn` in a trait (stable since 1.75): one impl uses the
//! plain `async fn` form, the other manually returns a boxed future for
//! the same method.

use std::future::Future;
use std::pin::Pin;

#[allow(async_fn_in_trait)]
pub trait AsyncCheck {
    async fn check(&self) -> bool;
}

/// Plain `async fn` implementation.
pub struct SyncStyleCheck {
    pub ok: bool,
}

impl AsyncCheck for SyncStyleCheck {
    async fn check(&self) -> bool {
        self.ok
    }
}

/// Same trait method, implemented by manually boxing the future.
pub struct BoxedStyleCheck {
    pub ok: bool,
}

impl AsyncCheck for BoxedStyleCheck {
    #[allow(refining_impl_trait_reachable)]
    fn check(&self) -> Pin<Box<dyn Future<Output = bool> + '_>> {
        Box::pin(async move { self.ok })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn both_styles_agree() {
        let a = SyncStyleCheck { ok: true };
        let b = BoxedStyleCheck { ok: true };

        assert_eq!(a.check().await, b.check().await);
    }
}
