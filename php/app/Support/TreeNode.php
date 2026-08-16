<?php

namespace App\Support;

/**
 * Direction-surface self-reference: children/parent point back at this same
 * class. A USES edge, never inheritance (this class does not extend itself).
 */
final class TreeNode
{
    /** @var list<TreeNode> */
    public array $children = [];

    private ?TreeNode $parentNode = null;

    public function addChild(TreeNode $child): void
    {
        $child->parentNode = $this;
        $this->children[] = $child;
    }

    public function parent(): ?TreeNode
    {
        return $this->parentNode;
    }
}
