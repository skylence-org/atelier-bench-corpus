# fixtures

Negative cases for parsers and indexers. **Do not fix anything in here.**

| Path | Why it exists |
| --- | --- |
| `broken-syntax/unclosed_impl.rs` | Unterminated `impl` block: the parser must report an error, not a partial tree |
| `broken-syntax/bad_generics.rs` | Unbalanced generic brackets and a truncated `where` clause |

Nothing under `fixtures/` belongs to a crate, so `cargo build` never sees these
files. `cargo run -p bench-verify -- --lint` asserts the opposite of the usual
check: every file here must still **fail** to compile.
