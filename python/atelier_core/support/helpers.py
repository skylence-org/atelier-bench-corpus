"""
Module-level constants and free functions: `ATELIER_REF_PREFIX` and
`atelier_format_reference` are the definition targets for constant / free
function lookups, and `@overload` gives the formatter two typing signatures
over one implementation.
"""

from __future__ import annotations

from typing import NamedTuple, overload

from .reference import Reference

ATELIER_REF_PREFIX = "AT"
ATELIER_REF_WIDTH = 6


class ParsedReference(NamedTuple):
    """`NamedTuple`: fields are class-body annotations, not assignments."""

    prefix: str
    year: int
    num: int


@overload
def atelier_format_reference(prefix: str, num: int) -> str: ...


@overload
def atelier_format_reference(prefix: str, num: int, year: int) -> str: ...


def atelier_format_reference(prefix: str, num: int, year: int = Reference.DEFAULT_YEAR) -> str:
    """Formats `PREFIX-YEAR-NNNNNN` with a zero-padded width of ATELIER_REF_WIDTH."""
    sep = Reference.PREFIX_SEPARATOR
    return f"{prefix}{sep}{year}{sep}{num:0{ATELIER_REF_WIDTH}d}"


def atelier_parse_reference(reference: str) -> ParsedReference | None:
    """Inverse of atelier_format_reference; None when the shape is wrong."""
    parts = reference.split(Reference.PREFIX_SEPARATOR)
    if len(parts) != 3:
        return None
    prefix, year, num = parts
    return ParsedReference(prefix, int(year), int(num))
