"""Reference numbering constants — class attributes only, no instances needed."""


class Reference:
    """Class-level constants read as `Reference.PREFIX_SEPARATOR` etc."""

    PREFIX_SEPARATOR = "-"
    DEFAULT_YEAR = 2026
    FIRST_NUMBER = 1

    @staticmethod
    def next(current: int) -> int:
        return current + 1
