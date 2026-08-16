# atelier-bench-corpus

[![corpus](https://github.com/skylence-org/atelier-bench-corpus/actions/workflows/corpus.yml/badge.svg?branch=main)](https://github.com/skylence-org/atelier-bench-corpus/actions/workflows/corpus.yml)

Purpose-built **accuracy-bench corpora** for agent/tool evaluation over real application graphs.
One directory per language lane; each lane is self-contained and carries its own ground truth.

## Lanes

| Lane | Stack | Domain | Ground truth | Self-check |
| --- | --- | --- | --- | --- |
| `php/` | PHP 8.3+ · Laravel 13.20 · Filament 5.6 | repair atelier | `php/bench/tasks.json` | `php bench/verify_tasks.php` |
| `rust/` | Rust 2024 edition · cargo workspace | repair atelier (same domain) | `rust/bench/tasks.json` | `cargo run -p bench-verify` |

Both lanes model the **same** domain (customers, devices, repair orders, parts, technicians) so a
harness can compare tool accuracy across languages on structurally equivalent questions.

## Shared contract

Every lane ships the same three artifacts:

| Artifact | Role |
| --- | --- |
| `<lane>/bench/tasks.json` | Needle-based accuracy tasks (`from` → `expect` file/needle pairs), schema `version: 1` |
| `<lane>/bench/` verifier | Zero-third-party-dependency self-check: every needle must resolve to exactly **one** line |
| `<lane>/README.md` | Coverage map: which language/framework edge lives in which file |

Needles are strings, never line numbers, so the manifest survives edits. Any change under a lane's
task-target paths must leave that lane's verifier at **exit 0**, in the same commit.

Task `file` paths inside a lane's `tasks.json` are relative to that **lane root** (`php/`, `rust/`),
not to the repository root.

## Consumption (runner)

Consumers pin this tree via `corpora.lock.json`:

```json
{ "type": "git", "sha": "<commit>" }
```

1. Check out the pinned SHA.
2. Install per lane from the **committed** lockfile — `composer install` in `php/`, `cargo build --locked` in `rust/`. No unlock, no update.
3. No remote artifacts, no SSH private remotes, no vault/secrets required for install or seed.

## Negative cases

Each lane carries a `fixtures/broken-syntax/` directory of intentionally invalid source.
**Do not fix it** — those files are parser/indexer negative cases and are excluded from builds and linting.

## License

MIT. Corpus content is clean-room for bench use.
