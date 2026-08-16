"""Metrics concern mixin."""


class MetricsMixin:
    """Adds metrics tracking capability to any class."""

    _metrics: dict = {}

    def record_metric(self, name: str, value: float) -> None:
        """Record a metric value."""
        key = f"{self.__class__.__name__}.{name}"
        if key not in self._metrics:
            self._metrics[key] = []
        self._metrics[key].append(value)

    def get_metric(self, name: str) -> list[float]:
        """Get all recorded values for a metric."""
        key = f"{self.__class__.__name__}.{name}"
        return self._metrics.get(key, [])

    def average_metric(self, name: str) -> float:
        """Get the average of recorded metric values."""
        values = self.get_metric(name)
        return sum(values) / len(values) if values else 0.0
