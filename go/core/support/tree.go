package support

// TreeNode is the self-referential struct: a node whose children are nodes.
type TreeNode struct {
	Label    string
	Children []*TreeNode
}

// NewTreeNode builds a leaf.
func NewTreeNode(label string) *TreeNode {
	return &TreeNode{Label: label}
}

// Add appends a child and returns the parent, so calls chain.
func (n *TreeNode) Add(child *TreeNode) *TreeNode {
	n.Children = append(n.Children, child)
	return n
}

// Walk visits the node and every descendant depth-first. The visitor is a
// FUNCTION VALUE, so the recursion carries a closure through the whole tree.
func (n *TreeNode) Walk(visit func(node *TreeNode)) {
	visit(n)
	for _, child := range n.Children {
		child.Walk(visit)
	}
}

// Depth is the longest path to a leaf, counted in nodes.
func (n *TreeNode) Depth() int {
	deepest := 0
	for _, child := range n.Children {
		if childDepth := child.Depth(); childDepth > deepest {
			deepest = childDepth
		}
	}
	return deepest + 1
}

// LabelCounter returns a CLOSURE OVER A LOCAL VARIABLE: every call to the
// returned function mutates `seen`, which outlives this frame.
func LabelCounter() func(label string) int {
	seen := map[string]int{}
	return func(label string) int {
		seen[label]++
		return seen[label]
	}
}

// CountLabels walks the tree with a closure that captures its own counter.
func (n *TreeNode) CountLabels() int {
	total := 0
	n.Walk(func(node *TreeNode) {
		total++
	})
	return total
}
