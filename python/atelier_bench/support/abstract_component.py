"""Root base: identity plus logging through the MRO."""

from __future__ import annotations

from ..concerns.has_logging import HasLogging


class AbstractComponent(HasLogging):
    def __init__(self, slug: str, title: str) -> None:
        if type(self) is AbstractComponent:
            raise TypeError("AbstractComponent is a base, not a component")
        self.slug = slug
        self.title = title
