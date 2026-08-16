"""Domain error hierarchy: one base, three subclasses, HTTP status carried along."""


class AtelierError(Exception):
    """Base for every domain error; `status_code` is what the HTTP layer answers with."""

    def __init__(self, message: str, status_code: int) -> None:
        super().__init__(message)
        self.status_code = status_code

    @property
    def client_visible(self) -> bool:
        return self.status_code < 500


class NotFoundError(AtelierError):
    def __init__(self, kind: str, key: str) -> None:
        super().__init__(f"no {kind} with key {key}", 404)
        self.kind = kind
        self.key = key


class IllegalTransitionError(AtelierError):
    def __init__(self, source: str, target: str) -> None:
        super().__init__(f"illegal transition {source} -> {target}", 409)
        self.source = source
        self.target = target


class ValidationError(AtelierError):
    def __init__(self, field: str, message: str) -> None:
        super().__init__(message, 422)
        self.field = field
