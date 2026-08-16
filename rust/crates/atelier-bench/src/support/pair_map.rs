//! Generic impl with two type params and a `where` clause.

pub struct PairMap<K, V> {
    entries: Vec<(K, V)>,
}

impl<K, V> PairMap<K, V>
where
    K: PartialEq,
    V: Clone,
{
    pub fn new() -> Self {
        Self { entries: Vec::new() }
    }

    pub fn insert(&mut self, key: K, value: V) {
        self.entries.push((key, value));
    }

    pub fn get(&self, key: &K) -> Option<V> {
        self.entries
            .iter()
            .find(|(existing, _)| existing == key)
            .map(|(_, value)| value.clone())
    }
}

impl<K, V> Default for PairMap<K, V>
where
    K: PartialEq,
    V: Clone,
{
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn round_trips_a_value() {
        let mut map: PairMap<&str, i32> = PairMap::new();
        map.insert("a", 1);

        assert_eq!(map.get(&"a"), Some(1));
    }
}
