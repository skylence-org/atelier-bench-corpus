/**
 * Self-referential node.
 *
 * Direction edge: every type in this file is `TreeNode` itself. `children` is
 * an array of the declaring class and `parent` points back at one, so a tool
 * must report the reference as self-directed, not as an edge to something else.
 */

export class TreeNode {
    /**
     * @param {string} label
     * @param {TreeNode | undefined} [parent]
     */
    constructor(label, parent = undefined) {
        this.label = label;

        /** @type {TreeNode | undefined} */
        this.parent = parent;

        /** @type {TreeNode[]} */
        this.children = [];
    }

    /**
     * Attach a child and return it, so callers can keep descending.
     *
     * @param {TreeNode} child
     * @returns {TreeNode}
     */
    addChild(child) {
        child.parent = this;
        this.children.push(child);

        return child;
    }

    /**
     * Distance to the root, counted in parents.
     *
     * @returns {number}
     */
    depth() {
        return this.parent === undefined ? 0 : this.parent.depth() + 1;
    }

    /**
     * This node and every descendant, depth first.
     *
     * @returns {TreeNode[]}
     */
    flatten() {
        return this.children.reduce((all, child) => all.concat(child.flatten()), [this]);
    }
}
