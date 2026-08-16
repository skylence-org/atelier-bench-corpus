"""Console output helpers for the `seed` command."""

from __future__ import annotations

import atelier_bench.rules as rules
from atelier_bench import METRICS

from .state import AppState


def summarize(state: AppState) -> str:
    data = state.data
    return ", ".join(
        [
            f"seeded: {len(data.customers)} customer(s)",
            f"{len(data.orders)} order(s)",
            f"{len(data.parts)} part(s)",
            f"revenue {data.revenue_cents()}c",
        ]
    )


def metric_lines(state: AppState) -> list[str]:
    return [f"{entry.key} = {entry.formatted(state.data)}" for entry in METRICS]


def rule_line(state: AppState) -> str:
    return f"rules: {len(rules.RuleRegistry.satisfied(state.data))}/{len(rules.RULES)} satisfied"
