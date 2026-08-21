# atelier-bench-corpus / php lane

Accuracy-bench corpus for agent/tool evaluation over a real Laravel + Filament application graph.
Same repair-atelier domain as the `rust/` and `typescript/` lanes (customers, devices, repair
orders, parts, technicians), with deliberate **PHP / Laravel / Livewire / Filament** edges for
definition/reference/resolution tasks. The shared lane contract lives in [`../README.md`](../README.md).

Clean-room, **zero code copied** from any prior fixture (operator order 2026-07-16).

## Stack

| Piece | Pin / constraint |
| --- | --- |
| PHP | `^8.3` |
| Laravel | **13.20** (`laravel/framework` ^13.8; runtime verified 13.20.x) |
| Filament | **5.6** (`filament/filament` ^5.6) |
| Database | SQLite (`database/database.sqlite`; tests run on `:memory:`) |
| Seeder | Deterministic fixed rows in `DatabaseSeeder` — **no faker randomness** in the corpus seed path |
| First-party vendor breadth | 43 laravel/livewire/filament packages in the lock (operator order 2026-07-16): horizon, telescope*, sanctum, passport, cashier, scout, socialite, fortify, pennant, pulse*, reverb, octane, folio, slack-notification-channel, volt, flux, the three Filament spatie plugins, plus dev: dusk, breeze, envoy, sail. *Telescope/Pulse ship disabled via env (no migrations run); packages are present for vendor-resolution benchmarking, not wired into app behavior. |

Install from the **committed** `composer.lock` only (`composer install`). Do not freestyle
`composer update` on a bench machine if you need bit-stable ground truth.

## Layout

| Path | Role | .php files |
| --- | --- | --- |
| `app/` | Domain models, enums, concerns, services, events, policies, jobs, HTTP + Livewire + Filament surfaces | 268 |
| `app/Bench/` | Breadth subsystem: 8 contracts, 8 concerns, 7 abstract bases, 24 reports (+ `ReportRegistry` fan-in), 16 metrics, 8 exporters, 8 notifiers, 8 repositories, 12 services, 48 rules | 151 |
| `database/` | Migrations, factories, deterministic `DatabaseSeeder`, delegating `CanonicalSeeder` | 41 |
| `routes/` | `web.php`, `api.php`, `console.php` | 3 |
| `resources/views/` | Report view, Blade components, Livewire SFC, Filament pages | 12 |
| `tests/` | Feature suite (44 tests / 171 assertions), Dusk scaffold | 17 |
| `bench/` | `tasks.json` + `verify_tasks.php` self-check; **zero composer dependencies** | 1 |
| `fixtures/broken-syntax/` | Intentionally invalid PHP + Blade, **DO NOT FIX** | 2 |

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
| Feature tests (incl. Livewire::test) | `tests/Feature/*`: 34 tests / 86 assertions covering HTTP, lifecycle/events, all Livewire components, observer registration, the full relationship matrix, and every package integration |
| COMPLETE Eloquent relationship matrix | BelongsTo, HasOne, HasMany, BelongsToMany+pivot, HasOneThrough (Device→invoice), HasManyThrough (Customer→statusLogs), HasOne/MorphOne `ofMany`, MorphTo, MorphOne (Signature), MorphMany (Note), MorphToMany/MorphedByMany first-party (Label/labelables) AND vendor (spatie tags on Part). Proven in `tests/Feature/RelationshipsTest.php` |
| First-party packages USED as intended (auth, billing, search, flags, broadcast) | sanctum guard on the API mutation + HasApiTokens · passport guard `api` · cashier Billable on User · scout Searchable on Part (database driver) · pennant `rush-surcharge` flag in RushInvoiceCalculator · reverb-ready ShouldBroadcast event + private channel · socialite login pair · fortify actions + TwoFactorAuthenticatable |
| First-party packages USED as intended (pages, UI, ops, plugins) | folio pages (incl. filename binding) · volt functional component at /rush-counter · flux badge + layout · horizon/octane/telescope/pulse configured (recorders env-gated) · slack notification (guarded) · spatie media/tags/settings via Filament plugins. Proven in `tests/Feature/IntegrationsTest.php` |
| Wide contract implementation | `app/Bench/`: 24 reports, 16 metrics, 8 exporters, 8 notifiers, 8 repositories, 12 services over 8 contracts, 8 concerns and 7 abstract bases |
| Cardinality (exact-count fan-in) | `app/Bench/Contracts/RuleContract` — 48 implementors under `app/Bench/Rules/`, fanned in through `RuleRegistry::RULES`; existing `ReportContract` (24 implementors) |
| Direction (edge orientation) | `dir-contract-parent`/`dir-implementor-child` on `ReportContract` → `CashFlowReport` → `AbstractPeriodicReport`; `dir-self-reference` on `app/Support/TreeNode` (USES, never inheritance) |
| Import-precision (one-of-many, const vs function) | `app/Support/Units.php` (global const + function) consumed one-at-a-time by `app/Support/Formatting/{UnitLabel,UnitFormatter}`; sibling pair `app/Support/Pair/{Left,Right}` with a Left-only consumer |
| Collision (lane-local resolution) | Names colliding with `rust/`/`typescript/` lanes — `Money`, `Customer`, `DatabaseSeeder` (the lane's `Dataset`), `ATELIER_REF_PREFIX`, `InvoiceCalculator::calculate`, `Formatter` — each resolved to this lane's declaration |
| Multi-parent declarations | `app/Bench/Contracts/CompositeContract` (three parent interfaces); `app/Bench/Reports/CashFlowReport` (one `extends` + two `implements`; the composite implementor is an existing report so `ReportContract` stays at 24) |
| Framework magic 1/2 (string-keyed edges) | facade static call (`Log::info` -> `Illuminate\Log\LogManager::info`), gate ability (`allows('update')` -> `RepairOrderPolicy::update`), query scope (`->open()` -> `scopeOpen`), `Attribute::get` accessor (`display_name` -> `displayName()`), container string key (`app('atelier.clock')` -> the `singleton` line) |
| Framework magic 2/2 (string-keyed edges) | middleware alias (`record.visit` -> `RecordReportVisit`), route -> controller method + `{repairOrder:reference}` binding, `config('atelier.labor_rate_cents')` -> `config/atelier.php`, `__('atelier.note_created')` -> `lang/en/atelier.php`; probes in `app/Support/Edge/StringKeyProbe.php` |
| Canonical shared ids: call sites | `app/Support/Canonical/CanonicalProbe` carries the global-function, class-const, static-factory, container-resolved-contract and error-throw call sites the shared ids point at |
| Canonical shared ids: resolution edges | `app/Support/Canonical/`: `Exports/barrel.php` aliasing `Ledger` (re-export with no declaration of its own), `TypeOnlyProbe` (docblock-only import), `DuckFormatter` (duck-typed `FormatterContract` satisfier) |
| Canonical shared ids: row fan-in | `app/Support/Canonical/Reporting/ReportRow::rowFromCents`, called once by each of the 8 `Reporting/Summaries/*` |
| Report fan-in registry | `app/Bench/Reports/ReportRegistry::REPORTS`, the 24 `ReportContract` implementors in one constant, mirroring `RuleRegistry::RULES` |
| Delegating seeder | `database/seeders/CanonicalSeeder` calls `DatabaseSeeder::class`, giving the frozen dataset an in-code reference instead of only an artisan string |
| Document-symbol + call-hierarchy | `app/Bench/Reports/ReportRegistry` (4 named symbols) for the symbol listing; `complete` → `transitionTo`, three callers of `transitionTo` (model, seeder, feature test), and `ReportController::show` → both aliased `Formatter` halves for the call graph |
| Breadth (constructs that may be dropped) | `app/Support/Edge/`: enum-implements-interface, first-class callables, readonly promoted properties + readonly class, intersection types, `#[Attribute]` + reflection, `new` in initializer + `never` type, static closure + no-default `match`, named arguments, nullsafe chain, `@template`/`@extends` generics, trait with abstract method + static property, interface constant via implementor |

## Consumption (runner)

1. Check out the pinned SHA (see [`../README.md`](../README.md) for the `corpora.lock.json` contract).
2. `composer install` from the **committed** `composer.lock` (no unlock, no update).
3. No remote artifacts, no SSH private remotes, no secrets.

Local use:

```bash
composer install
cp .env.example .env   # if needed
php artisan key:generate
php artisan migrate --force
php artisan db:seed    # DatabaseSeeder — deterministic
php artisan test       # 44 tests, sqlite :memory:
```

Admin UI: `/admin` (Filament). Sample report path: `GET /report/{repairOrder:reference}` (see `ReportController`).

## Ground truth

| Artifact | Role |
| --- | --- |
| `bench/tasks.json` | 106 needle-based accuracy tasks (`from` → `expect` file/needle pairs): 40 original + 29 for the cardinality/direction/import-precision/collision/multi-parent/breadth surfaces (issue #7) + 10 framework-magic string-keyed edges + 24 shared canonical ids carried by the other lanes + 3 document-symbol/call-hierarchy surfaces |
| `bench/verify_tasks.php` | Self-check that every task needle still resolves to exactly one line |

```bash
php bench/verify_tasks.php          # resolve every file+needle pair (3 vendor-* tasks need composer install)
php bench/verify_tasks.php --lint   # php -l over app/ bench/ config/ database/ routes/
```

The verifier has **no composer dependencies**, so it also runs on a machine that has never installed
the corpus dependency tree (the three `vendor-*` tasks then report `file missing` by design).

Task `file` paths are relative to this lane root (`php/`), not to the repository root.

**Regenerate discipline:** any edit under `app/`, `routes/`, `resources/views/`, seeders, or other
task-target paths must leave `php bench/verify_tasks.php` at **exit 0**. If needles move, update
`bench/tasks.json` in the same change (bench lane owns `bench/`; app lanes keep needles green).

Broken fixtures under `fixtures/broken-syntax/` are out of scope for "fix until green" — they are
negative cases on purpose.

## License

MIT (Laravel skeleton lineage). Corpus content is clean-room for bench use.
