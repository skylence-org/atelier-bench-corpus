// DO NOT FIX. Intentionally invalid: unterminated impl block.

pub struct Broken {
    pub id: u32,
}

impl Broken {
    pub fn id(&self) -> u32 {
        self.id
    }

    pub fn label(&self) -> String {
        format!("broken-{}", self.id)
