# filament-bench-corpus

Purpose-built **accuracy-bench corpus** for agent/tool evaluation over a real Laravel + Filament app graph.

This corpus **replaces** two prior fixtures:

| Former fixture | Why it left |
| --- | --- |
| `filament-erp` (R2 tarball) | Remote artifact + unpack path; not a first-class git pin |
| `laravel-event-ticketing` (private git) | Private clone / SSH / secrets in the runner path |

**Operator order 2026-07-16.** Clean-room rewrite: **zero code copied** from either predecessor. Domain is a small repair-atelier (customers, devices, repair orders, parts, technicians) with deliberate language and framework edges for definition/reference tasks.

## Stack

| Piece | Pin / constraint |
| --- | --- |
| PHP | `^8.3` |
| Laravel | **13.20** (`laravel/framework` ^13.8; runtime verified 13.20.x) |
| Filament | **5.6** (`filament/filament` ^5.6) |
| Database | SQLite (`database/database.sqlite`) |
| Seeder | Deterministic fixed rows in `DatabaseSeeder` — **no faker randomness** in the corpus seed path |
| First-party vendor breadth | 43 laravel/livewire/filament packages in the lock (operator order 2026-07-16): horizon, telescope*, sanctum, passport, cashier, scout, socialite, fortify, pennant, pulse*, reverb, octane, folio, slack-notification-channel, volt, flux, the three Filament spatie plugins, plus dev: dusk, breeze, envoy, sail. *Telescope/Pulse ship disabled via env (no migrations run); packages are present for vendor-resolution benchmarking, not wired into app behavior. |

Install from the **committed** `composer.lock` only. Do not freestyle `composer update` on a bench machine if you need bit-stable ground truth.

## Coverage map

| Surface | Where |
| --- | --- |
| Enums with methods | `app/Enums` (`Priority`, `RepairStatus`) |
| Trait reuse | `app/Concerns/HasReference` used by Customer + RepairOrder models |
| Magic `__call` → `name_only` | `app/Concerns/ForwardsToSchedule` → `app/Support/Schedule`; live call sites in `DatabaseSeeder` (`nextSlot` / `bookSlot` on Technician) |
| Interface + 2 impls + container binding | `app/Contracts/InvoiceCalculator`, `app/Services/StandardInvoiceCalculator` + `RushInvoiceCalculator`, bind in `app/Providers/AppServiceProvider` |
| Same-name shadow pair (aliases) | `app/Billing/Formatter` vs `app/Reporting/Formatter` via aliases in `app/Http/Controllers/ReportController` |
| Custom cast | `app/Casts/Money` |
| Global fn + global const + class const | `app/Support/helpers.php` (`atelier_format_reference`, `ATELIER_REF_PREFIX`), `app/Support/Reference::PREFIX_SEPARATOR` |
| Events / listener / policy / job / command / middleware | `app/Events/RepairCompleted`, `app/Listeners/SendCompletionNotice`, `app/Policies/RepairOrderPolicy`, `app/Jobs/RecalculateInventory`, `app/Console/Commands/*`, `app/Http/Middleware/RecordReportVisit` |
| Laravel helper inventory (live HTTP path) | `app/Support/HelperInventory` via `ReportController` + `cache()->remember` |
| Filament resource / relation-manager / widget / custom page | `app/Filament/Resources/*`, relation managers under RepairOrders, `app/Filament/Widgets/RepairStats`, `app/Filament/Pages/InventoryReport` |
| Livewire `#[Computed]` | `app/Filament/Pages/InventoryReport` (`lowStockParts`) |
| Blade nav / report view | `resources/views/report/summary.blade.php` |
| Broken-syntax fixtures | `fixtures/broken-syntax`, **DO NOT FIX** (intentionally invalid for parser/indexer negative cases) |
| Livewire class components | `app/Livewire/{StatusBoard,PartsPicker,NoteComposer}`: `#[Url]`, `#[Locked]`, `#[On]` listeners + `dispatch()`, `#[Validate]`, DI in `mount()`, `WithPagination`, lifecycle hooks; full-page route `/board` |
| Livewire 4 single-file component | `resources/views/components/⚡order-tracker.blade.php` (anonymous class + `#[Computed]` inside a blade file); embedded via `<livewire:order-tracker>` in the report view |
| Livewire Form object | `app/Livewire/Forms/NoteForm` (`form.body` binding resolves through Form magic) |
| REST API + JsonResources + FormRequest | `routes/api.php`, `app/Http/Controllers/Api/OrderController`, `app/Http/Resources/{RepairOrderResource,PartResource}` (whenLoaded / whenPivotLoaded), `app/Http/Requests/StoreNoteRequest` |
| Localization | `lang/en/atelier.php` + `__('atelier.note_created')` in the API controller |
| Class-based Blade component | `app/View/Components/StatusBadge` + `<x-status-badge>` in the report view |
| Model factories + states | `database/factories/*Factory.php`, deterministic sequences; `RepairOrderFactory::rush()` / `::completed()` |
| Observer via attribute | `app/Observers/DeviceObserver` registered with `#[ObservedBy]` on Device |
| Feature tests (incl. Livewire::test) | `tests/Feature/*`: 13 tests / 39 assertions covering HTTP, lifecycle/events, all three Livewire components, observer registration |

### Migrations note

The five migrations `2026_07_16_08000*` (benchmark_tests / test_datasets / test_results / benchmark_metrics / measurements) are **pending provenance ruling**. Treat them as frozen/disputed until the board says otherwise; do not "clean them up" as part of corpus work.

## Consumption (runner)

Corpora consumers pin this tree via `corpora.lock.json`:

```json
{ "type": "git", "sha": "<commit>" }
```

Runner contract:

1. Check out the pinned SHA.
2. `composer install` from the **committed** `composer.lock` (no unlock, no update).
3. No R2 downloads, no SSH private remotes, no vault/secrets required for install or seed.

Local bootstrap (dev only):

```bash
composer install
cp .env.example .env   # if needed
php artisan key:generate
php artisan migrate --force
php artisan db:seed    # DatabaseSeeder — deterministic
```

Admin UI: `/admin` (Filament). Sample report path: `GET /report/{repairOrder:reference}` (see `ReportController`).

## Ground truth

| Artifact | Role |
| --- | --- |
| `bench/tasks.json` | Needle-based accuracy tasks (from → expect file/needle pairs) |
| `bench/verify_tasks.php` | Self-check that every task needle still resolves in the tree |

**Regenerate discipline:** any edit under `app/`, `routes/`, `resources/views/`, seeders, or other task-target paths must leave:

```bash
php bench/verify_tasks.php
```

at **exit 0**. If needles move, update `bench/tasks.json` in the same change (bench lane owns `bench/`; app lanes keep needles green).

Broken fixtures under `fixtures/broken-syntax/` are out of scope for "fix until green" — they are negative cases on purpose.

## Layout (short)

```
app/                 # domain + Filament + deliberate coverage surfaces
bench/               # tasks.json (+ verify_tasks.php self-check)
database/seeders/    # deterministic DatabaseSeeder
fixtures/            # broken-syntax (do not fix)
routes/              # web + api
resources/views/     # report + filament pages
```

## License

MIT (Laravel skeleton lineage). Corpus content is clean-room for bench use.
