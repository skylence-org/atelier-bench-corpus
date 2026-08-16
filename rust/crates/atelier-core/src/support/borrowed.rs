//! Lifetime surface: a borrowing view struct with an explicit lifetime
//! parameter, and a higher-ranked trait bound (`for<'x>`) on a closure.

/// Borrows a label for `'a`; every method hands the same borrow back out.
#[derive(Debug, Clone, Copy)]
pub struct Borrowed<'a> {
    label: &'a str,
}

impl<'a> Borrowed<'a> {
    pub fn new(label: &'a str) -> Self {
        Self { label }
    }

    /// The borrow escapes with the struct's lifetime, not the method's.
    pub fn label(&self) -> &'a str {
        self.label
    }
}

/// Higher-ranked bound: `f` must accept a `&str` of ANY lifetime.
pub fn apply_all<F>(items: &[&str], f: F) -> Vec<usize>
where
    F: for<'x> Fn(&'x str) -> usize,
{
    items.iter().map(|item| f(item)).collect()
}

/// Call site for both: a view over each label, then the HRTB helper.
pub fn label_widths(labels: &[&str]) -> Vec<usize> {
    let views: Vec<Borrowed<'_>> = labels.iter().map(|label| Borrowed::new(label)).collect();
    let borrowed: Vec<&str> = views.iter().map(|view| view.label()).collect();

    apply_all(&borrowed, str::len)
}
