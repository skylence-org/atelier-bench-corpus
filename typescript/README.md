# atelier-bench-corpus / typescript lane

Accuracy-bench corpus for agent/tool evaluation over a real TypeScript application graph.
Same repair-atelier domain as the `php/` and `rust/` lanes (customers, devices, repair orders,
parts, technicians), with deliberate **TypeScript** language edges for definition/reference/resolution
tasks.

## Stack

| Piece | Pin / constraint |
| --- | --- |
| Node | `>=22` (`package.json` `engines`) |
| TypeScript | `^5.7.2`, `strict`, `verbatimModuleSyntax` + `isolatedModules` on, `moduleResolution: bundler` |
| Modules | ESM everywhere (`"type": "module"`), relative imports without extensions |
| Layout | npm workspaces: 3 packages + 1 dependency-free verifier |
| Tests | vitest `^2.1.8` (`npm test`), request-level tests through supertest |
| Dataset | `Dataset.seeded()` — fixed rows, **no randomness** in the corpus seed path |
| Vendor breadth | express 5, zod, date-fns, uuid, supertest — present so resolution into `node_modules` is exercised, not for domain depth |

Install from the **committed** `package-lock.json` only (`npm ci`). Do not freestyle `npm update`
on a bench machine if you need bit-stable ground truth.

## Packages

| Package | Role | .ts files |
| --- | --- | --- |
| `packages/core` (`@atelier/core`) | Domain: models, enum/namespace merges, mixin + Proxy concerns, contracts, container binding, money, errors, events, policy, sibling pair, self-referential tree, type guard/assertion function | 32 src + 4 test |
| `packages/bench` (`@atelier/bench`) | Breadth subsystem: 8 contracts, 8 concerns, 7 abstract bases, 76 implementors, 48 RuleContract implementors (cardinality), a three-parent contract, 15 language-breadth fixtures, module augmentation, frozen dataset | 167 src + 2 test |
| `packages/app` (`@atelier/app`) | Application surface: express router, console commands, jobs, shadow-pair aliases | 11 src + 2 test |
| `bench/verify-tasks` | Ground-truth self-check; **zero third-party dependencies** (Node built-ins only) | 1 `.mjs` |

## Coverage map

| Surface | Where |
| --- | --- |
| Enum + namespace declaration merge | `packages/core/src/support/{status,priority}.ts` — `RepairStatus.label(...)` is a namespace function, `RepairStatus.Completed` an enum member |
| Class + namespace declaration merge | `packages/core/src/money.ts` — `Money.ZERO` is the namespace const, `new Money(1)` the class |
| Free function with overloads | `packages/core/src/support/helpers.ts` (`atelierFormatReference`: two overload signatures + one implementation) |
| Module const + static class const | `helpers.ts` `ATELIER_REF_PREFIX`; `support/reference.ts` `Reference.PREFIX_SEPARATOR` |
| Mixin ("trait") method | `packages/core/src/concerns/hasReference.ts` — `withReference(Base)`; `Customer` and `RepairOrder` extend the returned class, so `reference()` has no declaration in either model file |
| Proxy method forwarding | `packages/core/src/concerns/forwardsToSchedule.ts` — `technician.nextSlot()` has no declaration on `Technician`; it resolves into `support/schedule.ts` |
| Type alias over an intersection | `packages/core/src/models/technician.ts` (`Technician = TechnicianBase & ScheduleForwarded`) |
| Interface + 2 impls + container binding | `contracts/invoiceCalculator.ts`, `services/{standard,rush}InvoiceCalculator.ts`, `container.ts` |
| Same-name shadow pair (aliases) | `billing/formatter.ts` vs `reporting/formatter.ts`, reached through the `@atelier/core/billing` and `@atelier/core/reporting` subpath exports, aliased in `packages/app/src/state.ts`, called in `http/report.ts` |
| Barrel re-export | `packages/core/src/index.ts` declares nothing; a definition must land on the declaring module |
| Subpath `exports` map | `packages/core/package.json` `./billing`, `./reporting` |
| Module augmentation | `packages/bench/src/augmentations.ts` — `debugLabel()` added to `@atelier/core/billing` `Formatter` via `declare module` |
| Inferred type from a value | `packages/app/src/http/api.ts` — `StoreNote = z.infer<typeof storeNoteSchema>` |
| Discriminated union narrowing | `packages/core/src/events.ts` (`DomainEvent`, `event.kind === "repair_completed"`), `policy.ts` (`Actor`), `packages/app/src/commands/index.ts` (`Command`) |
| Structural concern (no `implements`) | `packages/bench/src/concerns/hasFormatting.ts` — `formatting` satisfies `HasFormatting` structurally |
| Type-only import | `import type { Container }` in `packages/core/src/models/repairOrder.ts` — no runtime edge |
| Generic interface pinned per implementor | `packages/core/src/contracts/repository.ts` (`Repository<Id, Rec>`), 8 implementors in `packages/bench/src/repositories/` |
| Abstract base fan-out | `packages/bench/src/support/abstractReport.ts` — 21 direct subclasses + `AbstractPeriodicReport` + 3 through it = 24 concrete reports |
| Trait-object registry fan-in | `packages/bench/src/index.ts` `REPORTS` (24 entries) / `METRICS` (16) |
| Error hierarchy | `packages/core/src/errors.ts` (`AtelierError` → `NotFoundError`, `IllegalTransitionError`, `ValidationError`); HTTP mapping in `packages/app/src/http/errors.ts` |
| Events / listener / observer / policy / job | `events.ts`, `observers.ts`, `policy.ts`, `packages/app/src/jobs.ts` |
| HTTP surface (express 5) | `packages/app/src/index.ts` router; handlers in `http/{report,api}.ts` |
| Wide contract implementation | 24 reports, 16 metrics, 8 exporters, 8 notifiers, 8 repositories, 12 services |
| Deterministic seed | `packages/bench/src/dataset.ts` `Dataset.seeded()` — revenue `58325`c, part cost `46300`c, gross profit `12025`c |
| Tests (incl. request-level) | 48 vitest tests: lifecycle, money, shadow pair, Proxy forwarding, breadth registry, augmentation, express routes, console commands, TSX views, async loaders, issue-#9 surfaces |
| TSX + JSX factory | `packages/app/src/views/{h.ts,reportCard.tsx,reportPage.tsx}`: `jsxFactory: "h"` (no framework), component + intrinsic elements + fragment |
| Ambient declarations | `packages/app/src/types/jsx.d.ts` (global `JSX` namespace), `packages/app/src/types/legacy-formatting.d.ts` (`declare module "atelier-legacy-formatting"`, type-only consumer in `http/legacy.ts`) |
| `paths` alias | `tsconfig.base.json` maps `@app/*` → `packages/app/src/*`; type-only import in `http/reportLoader.ts` |
| async / generators | `http/reportLoader.ts`: `async function`, `function*`, `async function*`, `for await` |
| Broken-syntax fixtures | `fixtures/broken-syntax`, **DO NOT FIX** (negative cases; excluded by `tsconfig.json`, so `tsc` never sees them) |
| Cardinality (nominal/structural split) | `packages/bench/src/contracts/ruleContract.ts` + `rules/` — 48 implementors: 24 nominal classes (`implements`), 24 structural object literals (16 typed `: RuleContract`, 8 via `satisfies RuleContract`) |
| Direction (parent/child/self/merge) | `dir-contract-parent`, `dir-implementor-child` over `ReportContract`/`AbstractReport`/`CashFlowReport`; `dir-self-reference` — new `packages/core/src/support/treeNode.ts`; `dir-declaration-merge-not-inheritance` — the existing `RepairStatus` enum/namespace merge, framed as a non-inheritance edge |
| Import precision | `packages/core/src/support/pair.ts` (`Left`/`Right`, one imported); type-only vs value import of `Container`; namespace import `import * as Rules from "./rules"`; barrel no-fanout on `Customer` |
| Collision (lane-local) | 6 tasks pinning `Money`, `Customer`, `Dataset`, `ATELIER_REF_PREFIX`, `InvoiceCalculator.calculate`, the billing `Formatter` as this lane's own declarations |
| Multi-parent | `packages/bench/src/contracts/compositeContract.ts` (`CompositeContract extends` 3 interfaces); `packages/bench/src/reports/dailyRevenueReport.ts` (1 `extends` + 2 `implements` on an existing report, so `ReportContract` stays at 24 implementors) |
| Breadth (language-feature fixtures) | `packages/bench/src/support/{unwrap,flags,slug,rulesConfig,logged,arrayAugmentation,uniqueKey,severity,adhoc,keyedLookup,worker}.ts`, `packages/core/src/support/orderGuards.ts`, an overloaded `Money.plus`, and `export * as Rules from "./rules"` — conditional/mapped/template-literal types, `satisfies`, a standard TC39 decorator, global augmentation, type guard + assertion function, `unique symbol`, `const enum`, class expression, `keyof typeof`, class method overload, class/interface declaration merging, `export * as` |

## Consumption (runner)

1. Check out the pinned SHA.
2. `npm ci` (no unlock, no update).
3. No remote artifacts beyond the npm registry, no SSH private remotes, no secrets.

Local use:

```bash
npm run typecheck               # tsc --noEmit -p tsconfig.json
npm test                        # 48 tests
```

The console entrypoint is `packages/app/src/main.ts` (`serve [port]`, `seed`, `report [slug]`,
`recalculate`); the request-level and console tests in `packages/app/tests/` drive both surfaces
without a TS loader, so no runtime loader is pinned.

HTTP surface: `GET /report/:reference` (e.g. `AT-2026-000001`), `GET /api/orders`,
`GET /api/reports/:slug`, `POST /api/orders/:id/notes`, `GET /health`.

## Ground truth

| Artifact | Role |
| --- | --- |
| `bench/tasks.json` | 87 needle-based accuracy tasks (`from` → `expect` file/needle pairs): 44 original + 34 failure-mode surfaces (issue #9) + 9 TSX/ambient/paths/async edges |
| `bench/verify-tasks/verify.mjs` | Self-check that every task needle still resolves to exactly one line |

```bash
npm run verify                              # resolve every file+needle pair
npm run verify:lint                         # tsc over the lane + broken-fixture guard
node bench/verify-tasks/verify.mjs          # same as npm run verify; needs no node_modules
node bench/verify-tasks/verify.mjs --root <dir>   # verify another lane-shaped directory
```

The verifier uses **Node built-ins only** (`node:fs`, `node:path`, `node:url`, `node:child_process`,
`node:process`), so it also runs on a machine that has never run `npm ci`. Only `--lint` needs
`node_modules` (it shells out to `npx tsc`).

Task `file` paths are relative to this lane root (`typescript/`), not to the repository root.

**Regenerate discipline:** any edit under `packages/` or `fixtures/` must leave
`npm run verify` at **exit 0**. If needles move, update `bench/tasks.json` in the same change.

## License

MIT. Corpus content is clean-room for bench use.
