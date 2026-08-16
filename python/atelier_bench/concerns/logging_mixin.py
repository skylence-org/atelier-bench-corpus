"""Logging concern mixin."""

import logging


class LoggingMixin:
    """Adds logging capability to any class."""

    def _log(self, level: int, message: str) -> None:
        """Log a message at the specified level."""
        logger = logging.getLogger(self.__class__.__module__)
        logger.log(level, message)

    def debug(self, message: str) -> None:
        """Log at debug level."""
        self._log(logging.DEBUG, message)

    def info(self, message: str) -> None:
        """Log at info level."""
        self._log(logging.INFO, message)

    def warning(self, message: str) -> None:
        """Log at warning level."""
        self._log(logging.WARNING, message)

    def error(self, message: str) -> None:
        """Log at error level."""
        self._log(logging.ERROR, message)
