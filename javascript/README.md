# atelier-bench-corpus / javascript lane

Accuracy-bench corpus for agent/tool evaluation over a real JavaScript application graph.
Same repair-atelier domain as the `php/`, `rust/` and `typescript/` lanes (customers, devices,
repair orders, parts, technicians), with deliberate **JavaScript** edges for
definition/reference/resolution tasks.

This lane is **not** the typescript lane with the types deleted. Its value is the resolution
problem TypeScript hides: no declared types, CommonJS/ESM interop, prototype chains,
`module.exports` shapes, dynamic `require`, string-keyed events, and JSDoc as the only type
surface.

## Stack

| Piece | Pin / constraint |
| --- | --- |
| Node | `>= 22.12` (`require(esm)` must be available: the CommonJS bench package requires the ESM core) |
| Layout | npm workspaces, 3 packages + 1 dependency-free verifier |
| Dependencies | `express@5` (runtime); dev: `supertest`, plus exact-pinned `typescript`, `@types/node`, `@types/express` for the checkJs gate only (no TypeScript sources, no `.d.ts`) |
| Test runner | `node --test` (`node:test` + `node:assert/strict`), zero test-runner dependencies |
| Build step | none: everything runs from source with `node` |
| Dataset | `Dataset.seeded()` — fixed rows, **no randomness** in the corpus seed path |

Install from the **committed** `package-lock.json` only (`npm ci`). Do not freestyle `npm update`
on a bench machine if you need bit-stable ground truth.

## Packages

| Package | Module system | Role | Files |
| --- | --- | --- | --- |
| `packages/core` | ESM (`"type": "module"`, `.js`) | Domain: models, prototypes, mixins, container bindings, money, errors, events | 31 |
| `packages/bench` | CommonJS (`.cjs`) | Breadth subsystem: 10 contracts, 8 concerns, 8 bases, 124 implementors | 131 |
| `packages/app` | ESM, imports the CommonJS package | Application surface: express router, console commands, jobs | 11 |
| `bench/verify-tasks` | ESM (`.mjs`) | Ground-truth self-check; **zero third-party dependencies** | 1 |

## Coverage map

| JS-specific edge | Where |
| --- | --- |
| Mixed module systems | `packages/core` is ESM, `packages/bench` is CommonJS, `packages/app` is ESM importing the CJS package |
| Default-import interop (ESM ← CJS) | `packages/app/src/state.js`: `import bench from "@atelier/bench"`, destructured after the fact |
| `require(esm)` (CJS → ESM) | `packages/bench/src/dataset.cjs`: `require("@atelier/core")` |
| `createRequire` (exactly one site) | `packages/app/src/commands/exportReport.js`: exporter module picked by format at call time |
| `module.exports = { ... }` object | `packages/bench/src/contracts/reportContract.cjs` |
| `exports.name =` assignments | `packages/bench/src/contracts/metricContract.cjs` |
| `module.exports = class` | all 24 `packages/bench/src/reports/<slug>.cjs` and 24 `packages/bench/src/rules/<key>.cjs` |
| `module.exports = require('./x')` re-export | `packages/bench/src/reportContract.cjs` |
| Prototype-based model | `packages/core/src/models/device.js`: `function Device(...)` + `Device.prototype.label = ...` |
| `Object.create` inheritance + parent `.call` | same file: `Laptop.prototype = Object.create(Device.prototype)` |
| `Object.assign(Target.prototype, mixin)` | `packages/core/src/concerns/hasReference.js` — `reference()` has no declaration in `customer.js` or `repairOrder.js` |
| `Proxy` forwarding | `packages/core/src/concerns/forwardsToSchedule.js`: `technician.nextSlot()` is undeclared on the owner |
| `#private` fields, getters/setters, static blocks | `packages/core/src/money.js` (private field + `get cents`, static block builds `Money.ZERO`), `packages/core/src/support/schedule.js` (private `#booked`, `capacity` getter/setter) |
| `Symbol.iterator` + generator | `packages/bench/src/dataset.cjs`: `for (const order of data)`, plus the `ordersOf` generator |
| `EventEmitter` with string event names | `packages/core/src/events.js`: `dispatcher.on('repair.completed', ...)` — a name-only edge |
| One operation in three styles | `packages/app/src/jobs.js`: `recalculateInventory(cb)`, `recalculateInventoryPromise()`, `recalculateInventoryAsync()` |
| Dynamic registry | `packages/bench/src/index.cjs`: `require(\`./reports/${slug}.cjs\`)`, with the static `REPORTS` array kept alongside |
| JSDoc as the only type surface | everywhere: `@typedef`, `@template` (`core/src/support/pick.js`), `@param`, `@returns`, `@type {import('./x.js').Y}`; `jsconfig.json` sets `checkJs` and `--lint` enforces the allowlist |
| createRequire + dynamic import() | `app/src/reportsIndex.js`: synchronous `require` of the CJS bench package from ESM, and `await import("@atelier/core/reporting")` with a static specifier |
| `this` rebinding | `packages/bench/src/support/abstractNotifier.cjs`: arrow vs function declaration inside one method, `.call`, and `.bind` in `boundSender()` |
| Same-name shadow pair | `packages/core/src/billing/formatter.js` vs `packages/core/src/reporting/formatter.js`; aliased in ESM (`Formatter as MoneyFormatter`, `packages/app/src/state.js`) and in CJS (`const { Formatter: StatusFormatter } = require(...)`, `packages/bench/tests/interop.test.cjs`) |
| Barrel that declares nothing + subpath exports | `packages/core/src/index.js` and the `exports` map in `packages/core/package.json` |
| Sibling pair, one imported | `packages/core/src/support/pair.js` (`Left` / `Right`); `packages/app/src/http/api.js` imports `Left` only |
| Self-referential type | `packages/core/src/support/treeNode.js` (`children`, `parent`) |
| Three parents / one extends + two mixins | `packages/bench/src/contracts/compositeContract.cjs`, `packages/bench/src/support/abstractCompositeReport.cjs` |
| One contract, 48 implementors | `packages/bench/src/rules/`: 24 classes + 24 object literals in `structural.cjs`, registered in `RuleRegistry.RULES` |
| Wide contract implementation | 24 reports, 16 metrics, 8 exporters, 8 notifiers, 8 repositories, 12 services |
| Deterministic seed | `packages/bench/src/dataset.cjs`: revenue `58325`c, part cost `46300`c, gross profit `12025`c |
| Tests (incl. request-level) | 70 tests: domain lifecycle, prototypes, Proxy forwarding, shadow pair, breadth registry, rules, CJS/ESM interop, express routes, console commands, the three job styles |
| Broken-syntax fixtures | `fixtures/broken-syntax`, **DO NOT FIX** (negative cases; nothing imports them) |

## Consumption (runner)

1. Check out the pinned SHA.
2. `npm ci` in `javascript/` (no unlock, no update).
3. No remote artifacts beyond the npm registry, no SSH private remotes, no secrets.

Local use:

```bash
npm ci
npm test                             # node --test, 70 tests
npm run verify                       # 62 ground-truth tasks
npm run verify:lint                  # node --check over packages/ + broken-fixture guard
node packages/app/src/main.js serve 8080
node packages/app/src/main.js seed
node packages/app/src/main.js report gross-profit
node packages/app/src/main.js recalculate
```

HTTP surface: `GET /report/:reference` (e.g. `AT-2026-000001`), `GET /api/orders`,
`GET /api/reports/:slug`, `POST /api/orders/:id/notes`, `GET /health`.

## The JSDoc typecheck is a hard gate with an allowlist

`jsconfig.json` sets `checkJs: true`; `verify.mjs --lint` runs `node_modules/.bin/tsc -p jsconfig.json`
(typescript, `@types/node` and `@types/express` are exact-pinned devDependencies, so `npm ci` always
provides it) and compares the diagnostics, normalised to `<file>: error TS<code>: <message>` (line and
column stripped), against `bench/checkjs-allowlist.txt`. The gate fails on any diagnostic that is not
allowlisted AND on any allowlisted diagnostic that no longer occurs; regenerate the file with
`node bench/verify-tasks/verify.mjs --lint --write-allowlist` and review the diff like code.

A fixed set of diagnostics is expected, because the edges this lane exists for — `Object.assign`
mixins, `Proxy` forwarding, prototype assignment, CJS `require` of ESM-typed files — are precisely
what `checkJs` cannot model: `order.reference()` reported as missing on `RepairOrder` is the lane
working as designed. At the pinned versions the allowlist holds **60 diagnostics** (TS1542/TS1479
CJS-imports-ESM-types, TS2339 on mixin-injected members, TS2769/TS2345/TS2322 on Proxy/generic
variance). What the gate catches is anything NEW: an earlier head shipped 8 extra `TS2307` from a real
gap — `@atelier/core/contracts/repository.js` was missing from the core `exports` map, so a specifier
used only inside JSDoc `import(...)` types was unresolvable while every test, `node --check` and the
needle verifier stayed green. `packages/bench/tests/interop.test.cjs` also resolves every `@atelier/*`
specifier in the lane, so that class of defect fails a test as well as the gate.

## Ground truth

| Artifact | Role |
| --- | --- |
| `bench/tasks.json` | 62 needle-based accuracy tasks (`from` → `expect` file/needle pairs): 53 original + 9 (EventEmitter subclass, callback/promise/async trio, same-name command vs job, createRequire, @template, dynamic import(), aligned def-container-binding) |
| `bench/checkjs-allowlist.txt` | The exact `tsc -p jsconfig.json` diagnostics the gate accepts (60 at the pinned versions); regenerate with `--lint --write-allowlist` |
| `bench/verify-tasks/verify.mjs` | Self-check that every task needle still resolves to exactly one line |

```bash
node bench/verify-tasks/verify.mjs           # resolve every file+needle pair
node bench/verify-tasks/verify.mjs --lint    # node --check + broken-fixture guard
node bench/verify-tasks/verify.mjs --root .  # verify another lane-shaped directory
```

The verifier uses **node built-ins only**, so it also runs on a machine that has never installed
this lane's dependencies (verified against a copy of `bench/ packages/ fixtures/` with no
`node_modules` present).

Task `file` paths are relative to this lane root (`javascript/`), not to the repository root.
Task IDs shared with the other lanes (`card-*`, `dir-*`, `imp-*`, `lane-local-*`, `parents-*`) ask
the same question in every language, so a harness can line the lanes up.

**Regenerate discipline:** any edit under `packages/` or `fixtures/` must leave
`node bench/verify-tasks/verify.mjs` at **exit 0**. If needles move, update `bench/tasks.json` in
the same change.

## License

MIT. Corpus content is clean-room for bench use.
