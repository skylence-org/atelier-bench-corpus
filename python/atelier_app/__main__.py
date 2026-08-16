"""`python -m atelier_app <command>` entry point."""

from __future__ import annotations

import sys

from . import serve
from .commands import parse_command, usage
from .commands.export_report import export_report
from .commands.recalculate_inventory import recalculate_inventory
from .seed import metric_lines, rule_line, summarize
from .state import seeded_state


def main(argv: list[str]) -> int:
    state = seeded_state()
    command = parse_command(argv)
    match command.kind:
        case "serve":
            serve(state, command.port)
        case "seed":
            print(summarize(state))
            for line in metric_lines(state):
                print(line)
            print(rule_line(state))
        case "report":
            print(export_report(state, command.slug))
        case "recalculate":
            print(recalculate_inventory(state))
        case _:
            print(usage())
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
