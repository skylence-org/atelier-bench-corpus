"""Console command parsing with structural pattern matching."""

from __future__ import annotations

from dataclasses import dataclass

DEFAULT_PORT = 8080


@dataclass(frozen=True)
class Command:
    kind: str
    port: int = DEFAULT_PORT
    slug: str = "gross-profit"


def parse_command(args: list[str]) -> Command:
    match args:
        case ["serve", port, *_]:
            return Command("serve", port=int(port) if port.isdigit() else DEFAULT_PORT)
        case ["serve"]:
            return Command("serve")
        case ["seed", *_]:
            return Command("seed")
        case ["report", slug, *_]:
            return Command("report", slug=slug)
        case ["report"]:
            return Command("report")
        case ["recalculate", *_]:
            return Command("recalculate")
        case _:
            return Command("help")


def usage() -> str:
    return "usage: atelier <serve [port]|seed|report [slug]|recalculate>"
