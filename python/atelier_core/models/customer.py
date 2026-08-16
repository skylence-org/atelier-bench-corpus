"""Customer: gets `reference()` from the HasReference MIXIN CLASS (MRO), prefix overridden to CU."""

from __future__ import annotations

from ..concerns.has_reference import HasReference


class Customer(HasReference):
    reference_prefix = "CU"

    def __init__(self, id: int, name: str, email: str, phone: str | None = None) -> None:
        self.id = id
        self.name = name
        self.email = email
        self.phone = phone

    def display_name(self) -> str:
        return f"{self.name} <{self.email}>"

    def is_reachable(self) -> bool:
        return self.phone is not None or self.email != ""

    @classmethod
    def seed(cls, id: int, name: str, email: str, phone: str | None = None) -> "Customer":
        """Alternate constructor: the reference number follows the id."""
        customer = cls(id, name, email, phone)
        customer.reference_number = id
        return customer
