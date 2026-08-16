"""Serializable concern mixin."""

import json


class SerializableMixin:
    """Adds serialization capability to any class."""

    def to_dict(self) -> dict:
        """Convert object to dictionary."""
        result = {}
        for key, value in self.__dict__.items():
            if not key.startswith("_"):
                result[key] = value
        return result

    def to_json(self) -> str:
        """Convert object to JSON string."""
        return json.dumps(self.to_dict(), default=str)

    @classmethod
    def from_dict(cls, data: dict):
        """Create object from dictionary."""
        return cls(**data)

    @classmethod
    def from_json(cls, json_str: str):
        """Create object from JSON string."""
        data = json.loads(json_str)
        return cls.from_dict(data)
