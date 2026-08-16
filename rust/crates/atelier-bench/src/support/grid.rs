//! Const generics: dimensions live in the type, not a runtime field.

/// Fixed-size grid whose dimensions are compile-time constants.
#[derive(Debug, Clone, Copy)]
pub struct Grid<const W: usize, const H: usize> {
    cells: [[bool; H]; W],
}

impl<const W: usize, const H: usize> Grid<W, H> {
    pub const fn new() -> Self {
        Self {
            cells: [[false; H]; W],
        }
    }

    pub const fn area(&self) -> usize {
        W * H
    }

    pub fn set(&mut self, x: usize, y: usize, value: bool) {
        self.cells[x][y] = value;
    }

    pub fn get(&self, x: usize, y: usize) -> bool {
        self.cells[x][y]
    }
}

impl<const W: usize, const H: usize> Default for Grid<W, H> {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn area_multiplies_dimensions() {
        let mut grid: Grid<3, 4> = Grid::new();
        grid.set(1, 2, true);

        assert_eq!(grid.area(), 12);
        assert!(grid.get(1, 2));
    }
}
