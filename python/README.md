# atelier-bench-corpus / python lane

Accuracy-bench corpus for agent/tool evaluation over a real Python application graph.
Same repair-atelier domain as the other four lanes (customers, devices, repair orders, parts,
technicians), with deliberate **Python** language edges for definition/reference/resolution tasks:
the resolution problems Python creates that the other lanes cannot — decorators that graft
methods, `__getattr__` forwarding, multiple inheritance and the MRO, Protocols vs ABCs, string-keyed
`getattr`/`importlib` dispatch, PEP 562 module `__getattr__`, descriptors, name mangling, and type
hints as the only static-typing surface.

## Stack

| Piece | Pin / constraint |
| --- | --- |
| Python | `>=3.12` (CI runs 3.12; PEP 695 generics and `match` are used) |
| Layout | three importable packages at the lane root (`atelier_core`, `atelier_bench`, `atelier_app`); no build step, no install: run from the lane root |
| Dependencies | `Flask==3.1.1` (+ its pinned transitive deps) in `requirements.txt`; `mypy==1.17.1` in `requirements-dev.txt` for the type gate only |
| Test runner | `unittest` (stdlib), `python -m unittest discover -s tests -t .` |
| Dataset | `Dataset.seeded()` — fixed rows, **no randomness**; revenue `58325c`, part cost `46300c`, gross profit `12025c` |

## Packages

| Package | Role | .py files |
| --- | --- | --- |
| `atelier_core/` | Domain: models, Money, enums, Protocols, container, events, policy, both `Formatter` halves | 39 |
| `atelier_bench/` | Breadth subsystem: 8 contracts, 8 concerns, 8 abstract bases, 24 reports, 16 metrics, 8 exporters, 8 notifiers, 8 repositories, 12 services, 48 rules, dataset, registry | 140 |
| `atelier_app/` | Application surface: Flask routes, console commands, jobs (callback / Future / async) | 12 |
| `tests/` | 28 unittest tests incl. request-level (Flask test client) | 11 |
| `bench/` | `tasks.json` + `verify_tasks.py` (stdlib only) + `mypy-allowlist.txt` | 3 |
| `fixtures/broken-syntax/` | Intentionally invalid Python, **DO NOT FIX** | 2 |

## Coverage map

| Surface | Where |
| --- | --- |
| Enums with methods | `atelier_core/support/{status,priority}.py` (`transitions_to`, `surcharge_bp`) — `str` Enums |
| Mixin class (MRO) vs class decorator (`setattr`) | `concerns/has_reference.py`: `Customer(HasReference)` inherits `reference()`; `@with_reference()` grafts the same methods onto `RepairOrder`, which has no base and no declaration |
| `__getattr__` forwarding | `concerns/forwards_to_schedule.py`: `technician.next_slot()` resolves to `Schedule` at runtime |
| Protocol (structural) + 2 implementors + container binding | `contracts/invoice_calculator.py`, `services/{standard,rush}_invoice_calculator.py`, `container.py` |
| Same-name shadow pair (aliases) | `billing/formatter.py` vs `reporting/formatter.py`, aliased in `atelier_app/state.py`, called in `http/report.py` |
| Barrel + relative imports + `TYPE_CHECKING` | `atelier_core/__init__.py` re-exports only; `if TYPE_CHECKING:` imports are type-only edges |
| Operator overloads, `__slots__`, `@classmethod` / `@staticmethod` | `money.py` |
| `@property` with setter | `support/schedule.py` |
| `@dataclass`, `NamedTuple`, `TypedDict`, `Enum` | `support/tree_node.py`, `contracts/report_contract.py`, `contracts/notifier_contract.py`, `models/note.py` |
| `__init_subclass__` registries | `models/device.py` (`Device.KINDS`), `atelier_bench/support/abstract_report.py` (`REGISTRY` → the 24-entry report registry, no hand-written list) |
| Structural pattern matching | `policy.py` (`case Actor(role=..., id=...)`) |
| PEP 695 generics, `@overload` | `support/pick.py`, `support/helpers.py`, `contracts/repository.py` |
| Multiple inheritance / MRO | `contracts/composite_contract.py` (three parent ABCs), `support/abstract_composite_report.py` (one base + two mixins), `reports/cash_flow.py` (diamond) |
| Descriptor, name mangling, `types.MethodType` rebinding | `support/abstract_notifier.py` |
| `functools.singledispatch` | `contracts/formatter_contract.py` (`format_cell`) |
| `@contextmanager`, generators, `async def`, `concurrent.futures` | `support/abstract_service.py`, `dataset.py` (`__iter__`), `atelier_app/jobs.py` |
| String-keyed dispatch | `services/order_volume_service.py` (`getattr(self, f"scope_{...}")`), `atelier_app/commands/export_report.py` (importlib table) |
| PEP 562 module `__getattr__` + dynamic `importlib.import_module` | `atelier_bench/__init__.py` (`RULES` supplied lazily; `load_report(slug)` unresolvable statically) |
| Star import with `__all__` | `atelier_bench/support/metric_glob.py` |
| String-named events | `atelier_core/events.py` (`dispatcher.on("repair.completed", ...)`) |
| Cardinality (exact-count fan-in) | `RuleContract` — 24 nominal subclasses + 24 structural `AdHocRule` values = 48; `ReportContract` — 24 concrete reports |
| Direction / import-precision / collision / multi-parent | tasks `dir-*`, `imp-*`, `lane-local-*`, `parents-*` in `bench/tasks.json` (same ids as the other lanes) |
| Same-name functions in two modules | `atelier_app/commands/recalculate_inventory.py` vs `atelier_app/jobs.py` |
| HTTP surface (Flask) | `atelier_app/__init__.py`: `GET /report/<reference>`, `GET /api/orders`, `POST /api/orders/<id>/notes`, `GET /api/reports/<slug>`, `GET /health` |
| Tests (incl. request-level) | 28 unittest tests: money, lifecycle, forwarding, shadow pair, events, structure, breadth, http, console, jobs |
| Broken-syntax fixtures | `fixtures/broken-syntax`, **DO NOT FIX** (outside every package; `--lint` requires them to fail `py_compile`) |
| Document-symbol + call-hierarchy | `atelier_core/models/repair_order.py` (18 named symbols) and `atelier_bench/__init__.py` (8) for the symbol listing; `complete` → `transition_to`, three callers of `transition_to`, and `atelier_app.commands.recalculate_inventory` → `atelier_core` `SendCompletionNotice.subscribe` for the call graph |

## Consumption (runner)

1. Check out the pinned SHA.
2. `cd python && pip install -r requirements-dev.txt` (exact pins; `requirements.txt` alone is enough to run the app).
3. No remote artifacts beyond PyPI, no SSH private remotes, no secrets.

Local use (from `python/`):

```bash
python3 -m unittest discover -s tests -t . -v   # 28 tests
python3 -m atelier_app seed                      # summary + 16 metric lines + rules line
python3 -m atelier_app report gross-profit       # csv export
python3 -m atelier_app serve 8080
```

## Ground truth

| Artifact | Role |
| --- | --- |
| `bench/tasks.json` | 87 needle-based accuracy tasks (`from` → `expect` file/needle pairs) incl. the cardinality/direction/import-precision/collision/multi-parent surfaces from day one + 5 document-symbol/call-hierarchy surfaces |
| `bench/verify_tasks.py` | Self-check that every task needle still resolves to exactly one line; **standard library only** |
| Lane-specific `kind` strings | `setattr_mixin` (method grafted by a class decorator), `dynamic_attribute` (`__getattr__` forwarding), `property`, `dataclass_generated`, `class_creation_hook` (`__init_subclass__`), `descriptor`, `name_mangling`, `singledispatch`, `context_manager`, `same_name`, `pattern_match`, `module_getattr` (PEP 562), `unresolvable_static` (importlib with a runtime-built name), `string_key`, `mro`, `relative_import` |
| `bench/mypy-allowlist.txt` | The exact `mypy` diagnostics `--lint` accepts (5 at the pinned version: the setattr-grafted `reference()`/`reference_number` the lane exists to exercise); regenerate with `--lint --write-allowlist` |

```bash
python3 bench/verify_tasks.py            # resolve every file+needle pair
python3 bench/verify_tasks.py --lint     # py_compile over the lane + broken-fixture guard + mypy allowlist gate (needs requirements-dev)
python3 bench/verify_tasks.py --root <dir>   # verify another lane-shaped directory (used by bench/check-matrix.mjs)
```

Task `file` paths are relative to this lane root (`python/`), not to the repository root.

**Regenerate discipline:** any edit under `atelier_*/`, `tests/` or `fixtures/` must leave
`python3 bench/verify_tasks.py` at **exit 0**. If needles move, update `bench/tasks.json` in the same change.

## License

MIT. Corpus content is clean-room for bench use.
