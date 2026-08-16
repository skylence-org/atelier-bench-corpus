//! Recursive self-reference: `Expr` refers to itself through `Box`, which
//! is a self type reference, never an IMPLEMENTS edge.

use crate::money::Money;

/// A tiny arithmetic AST over [`Money`] literals.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Expr {
    Lit(Money),
    Add(Box<Expr>, Box<Expr>),
}

impl Expr {
    /// Fold the tree down to one [`Money`] value.
    pub fn eval(&self) -> Money {
        match self {
            Expr::Lit(amount) => *amount,
            Expr::Add(left, right) => left.eval() + right.eval(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn evaluates_nested_sum() {
        let tree = Expr::Add(
            Box::new(Expr::Lit(Money::from_cents(100))),
            Box::new(Expr::Add(
                Box::new(Expr::Lit(Money::from_cents(200))),
                Box::new(Expr::Lit(Money::from_cents(300))),
            )),
        );

        assert_eq!(tree.eval(), Money::from_cents(600));
    }
}
