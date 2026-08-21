package contracts

// Repository is a GENERIC INTERFACE: one type parameter, no constraint beyond
// any. Every concrete repository instantiates it with its own model type.
type Repository[T any] interface {
	All() []T
	Find(id int) (T, bool)
	Count() int
}

// Keyed is the constraint for repositories addressed by a string key.
type Keyed[T any] interface {
	Repository[T]
	ByKey(key string) (T, bool)
}

// CountOf works for any repository of any element type.
func CountOf[T any](repository Repository[T]) int {
	return repository.Count()
}
