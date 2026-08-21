//! Constructs added for the shared canonical ids.

use atelier_bench::concerns::has_audit::HasAudit;
use atelier_bench::concerns::has_metadata::HasMetadata;
use atelier_bench::contracts::digest_contract::DigestContract;
use atelier_bench::support::audit_digest::AuditDigest;
use atelier_bench::support::plain_row_formatter::PlainRowFormatter;

#[test]
fn digest_reaches_both_supertraits() {
    let mut digest = AuditDigest::new("counter");
    digest.record("intake").record("completed");

    assert_eq!(digest.audit_depth(), 2);
    assert_eq!(digest.meta_keys(), vec!["actor"]);
    assert_eq!(digest.digest(), "1/2");
}

#[test]
fn plain_formatter_carries_the_method_set_without_the_trait() {
    let formatter = PlainRowFormatter;

    assert_eq!(formatter.format_value(1.5), "1.50");
    assert_eq!(formatter.format_label("  paid  "), "paid");
}
