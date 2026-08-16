"""Self-referential type: children and parent are TreeNodes; a USES edge, never inheritance."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class TreeNode:
    """`@dataclass`: `__init__`, `__repr__` and `__eq__` are generated from these fields."""

    label: str
    parent: TreeNode | None = None
    children: list[TreeNode] = field(default_factory=list)

    def add_child(self, child: TreeNode) -> TreeNode:
        child.parent = self
        self.children.append(child)
        return child

    def depth(self) -> int:
        return 0 if self.parent is None else self.parent.depth() + 1

    def flatten(self) -> list[TreeNode]:
        flat: list[TreeNode] = [self]
        for child in self.children:
            flat.extend(child.flatten())
        return flat
