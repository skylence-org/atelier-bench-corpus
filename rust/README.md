# atelier-bench-corpus / rust lane

Accuracy-bench corpus for agent/tool evaluation over a real Rust application graph.
Same repair-atelier domain as the `php/` lane (customers, devices, repair orders, parts,
technicians), with deliberate **Rust** language edges for definition/reference/resolution tasks.

## Stack

| Piece | Pin / constraint |
| --- | --- |
| Rust | `1.96.0`, pinned in `rust-toolchain.toml` |
| Edition | 2024 (workspace `rust-version` floor is 1.85) |
| Layout | cargo workspace, 3 library/binary crates + 1 dependency-free verifier |
| Dataset | `Dataset::seeded()` — fixed rows, **no randomness** in the corpus seed path |
| Vendor breadth | axum, tokio, tower, serde, serde_json, chrono, uuid, indexmap, itertools, rayon, once_cell, thiserror, anyhow, tracing, tracing-subscriber — present so cross-crate resolution into `~/.cargo/registry` is exercised, not for domain depth |

Build from the **committed** `Cargo.lock` only (`cargo build --locked`). Do not freestyle
`cargo update` on a bench machine if you need bit-stable ground truth.

## Crates

| Crate | Role | .rs files |
| --- | --- | --- |
| `crates/atelier-core` | Domain: models, enums, traits, container bindings, money, errors | 40 |
| `crates/atelier-bench` | Breadth subsystem: 8 contracts, 8 concerns, 7 bases, 76 implementors | 111 |
| `crates/atelier-app` | Application surface: axum router, console commands, jobs | 14 |
| `bench/verify-tasks` | Ground-truth self-check; **zero third-party dependencies** | 2 |

## Coverage map

| Surface | Where |
| --- | --- |
| Enums with methods | `crates/atelier-core/src/support/{status,priority}.rs` (`transitions_to`, `surcharge_bp`) |
| Trait with a default body, reused | `concerns/has_reference.rs` implemented by `Customer` + `RepairOrder` |
| Associated const, overridden per impl | `HasReference::PREFIX` defaults to `ATELIER_REF_PREFIX`; `Customer` overrides it with `"CU"` |
| Trait + 2 impls + container binding | `contracts/invoice_calculator.rs`, `services/{standard,rush}_invoice_calculator.rs`, `Arc<dyn ...>` in `container.rs` |
| Same-name shadow pair (aliases) | `billing::Formatter` vs `reporting::Formatter`, aliased in `atelier-app/src/state.rs` and called in `http/report.rs` |
| `Deref` method forwarding | `Technician` → `Schedule`: `technician.next_slot()` has no declaration on `Technician` |
| `macro_rules!`-generated methods | `support/macros.rs` → `forwards_to_schedule!(Technician)` generates `peek_next_slot` / `book_next_slot` |
| Blanket impl (local bound) | `concerns/has_formatting.rs`: `impl<T: ReportContract> HasFormatting for T` |
| Blanket impl (foreign bound) | `concerns/has_serialization.rs`: `impl<T: serde::Serialize> HasSerialization for T` |
| Re-export chain | `atelier-core/src/lib.rs` `pub use` block — definition must land on the declaring module |
| Operator overloads + newtype | `money.rs`: `Add`/`AddAssign`/`Sub`/`Mul`/`Sum`/`Display`/`FromStr` on `Money` |
| Extension trait on a primitive | `money.rs`: `impl MoneyExt for i64` — `1_500_i64.cents()` |
| Associated types | `contracts/repository.rs` (`type Id` / `type Record`), pinned by 8 implementors cross-crate |
| Trait objects + registry fan-in | `atelier-bench/src/lib.rs`: `Lazy<Vec<Box<dyn ReportContract>>>` with 24 entries |
| Error enum + `?` conversions | `errors.rs` (`#[from] ParseMoneyError`, `#[from] serde_json::Error`) |
| Events / listener / observer / policy / job | `events.rs`, `observers.rs`, `policy.rs`, `atelier-app/src/jobs.rs` |
| Async + HTTP surface | `atelier-app/src/lib.rs` router; handlers in `http/{report,api}.rs`; `IntoResponse` in `http/errors.rs` |
| Parallel iteration (rayon) | `services/revenue_service.rs::metric_sweep` — also what forces `MetricContract: Send + Sync` |
| Wide contract implementation | 24 reports, 16 metrics, 8 exporters, 8 notifiers, 8 repositories, 12 services |
| Deterministic seed | `atelier-bench/src/dataset.rs::seeded` — revenue `58_325c`, part cost `46_300c`, gross profit `12_025c` |
| Tests (incl. request-level) | 46 tests: domain lifecycle, shadow pair, Deref/macro forwarding, breadth registry, axum routes, console commands, JSON parser |
| Broken-syntax fixtures | `fixtures/broken-syntax`, **DO NOT FIX** (negative cases; outside every crate, so cargo never sees them) |
| Cardinality: macro-generated half of a wide contract | `contracts/rule_contract.rs` + `rules/`: 48 `RuleContract` implementors, 24 textual (one file each) + 24 from `define_rules!` in `rules/generated.rs` |
| Direction: parent/child/self-reference/inherent | `dir-contract-parent`/`dir-implementor-child` (`ReportContract` ↔ `CashFlowReport`), `support/expr.rs` (`Expr` self-reference), `money.rs` inherent `impl Money` |
| Import-precision: one-of-siblings, cross-crate, glob | `support/pair.rs` (`Left`/`Right`, only `Left` imported), `dataset.rs` (`Money` without `ParseMoneyError`), `support/report_glob.rs` (`use ...report_contract::*;`) |
| Collision: lane-local identifiers | `Money`, `Customer`, `Dataset`, `ATELIER_REF_PREFIX`, `InvoiceCalculator::calculate`, `billing::Formatter` — same names exist in the php/typescript/javascript lanes |
| Multi-parent: three-way supertrait fan-in | `contracts/composite_contract.rs`: `CompositeContract: ReportContract + CacheableContract + ScheduleContract`, implemented by `CashFlowReport`; `&dyn CompositeContract` upcasts to `&dyn ReportContract` |
| Breadth: const generics, closures, async traits, cfg-gating | `support/grid.rs`, `support/closure_predicate.rs`, `support/pair_map.rs`, `support/rule_summary.rs` (`#[derive(Serialize)]`), `atelier-app/src/async_check.rs`, `rules/cfg_gated.rs`, `prelude.rs` + `rules_probe.rs` (two-level re-export) |

## Consumption (runner)

1. Check out the pinned SHA.
2. `cargo build --locked` (no unlock, no update).
3. No remote artifacts beyond crates.io, no SSH private remotes, no secrets.

Local use:

```bash
cargo test --workspace          # 46 tests
cargo clippy --workspace --all-targets -- -D warnings
cargo run -p atelier-app -- serve 8080
cargo run -p atelier-app -- seed
cargo run -p atelier-app -- report gross-profit
```

HTTP surface: `GET /report/{reference}` (e.g. `AT-2026-000001`), `GET /api/orders`,
`GET /api/reports/{slug}`, `POST /api/orders/{id}/notes`, `GET /health`.

## Ground truth

| Artifact | Role |
| --- | --- |
| `bench/tasks.json` | 44 needle-based accuracy tasks (`from` → `expect` file/needle pairs) |
| `bench/verify-tasks` | Self-check that every task needle still resolves to exactly one line |

```bash
cargo run -p bench-verify           # resolve every file+needle pair
cargo run -p bench-verify -- --lint # cargo check + broken-fixture guard
```

The verifier has **no third-party dependencies** — it ships its own JSON reader — so it also runs
on a machine that has never fetched the corpus dependency tree:

```bash
# run from this lane root: without cargo it resolves task paths against the cwd
rustc --edition 2024 bench/verify-tasks/src/main.rs -o /tmp/bench-verify && /tmp/bench-verify
```

Task `file` paths are relative to this lane root (`rust/`), not to the repository root.

**Regenerate discipline:** any edit under `crates/` or `fixtures/` must leave
`cargo run -p bench-verify` at **exit 0**. If needles move, update `bench/tasks.json` in the same
change (bench lane owns `bench/`; crate lanes keep needles green).

## License

MIT. Corpus content is clean-room for bench use.
