// DO NOT FIX. Intentionally invalid: unbalanced generics, truncated where clause.

pub struct Holder<T, U {
    pub left: T,
    pub right: U,
}

pub fn merge<T>(left: T, right: T) -> Vec<T
where
    T:
{
    vec![left, right]
}
