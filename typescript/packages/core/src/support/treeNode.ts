/** Self-referential structure: recursion lives in the type itself, not in inheritance. */

export interface TreeNode {
    readonly value: string;
    children: TreeNode[];
    parent?: TreeNode;
}
