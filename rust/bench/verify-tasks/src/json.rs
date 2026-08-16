//! Minimal recursive-descent JSON reader.
//!
//! Hand-rolled on purpose: the self-check has to run with nothing fetched, so
//! it cannot reach for `serde_json`. Supports exactly what `tasks.json` needs
//! -- objects, arrays, strings with escapes, numbers, booleans and null.

use std::fmt;

/// One parsed JSON value.
#[derive(Debug, Clone, PartialEq)]
pub enum Json {
    Null,
    Bool(bool),
    Number(f64),
    String(String),
    Array(Vec<Json>),
    /// Insertion-ordered so error output follows the file.
    Object(Vec<(String, Json)>),
}

impl Json {
    /// Member lookup on an object; `None` for every other kind.
    pub fn get(&self, key: &str) -> Option<&Json> {
        match self {
            Json::Object(entries) => entries
                .iter()
                .find(|(name, _)| name == key)
                .map(|(_, value)| value),
            _ => None,
        }
    }

    pub fn as_str(&self) -> Option<&str> {
        match self {
            Json::String(value) => Some(value),
            _ => None,
        }
    }

    pub fn as_array(&self) -> Option<&[Json]> {
        match self {
            Json::Array(items) => Some(items),
            _ => None,
        }
    }

    /// Both `file` and `needle` as strings, or `None` when either is missing.
    pub fn file_needle(&self) -> Option<(&str, &str)> {
        Some((self.get("file")?.as_str()?, self.get("needle")?.as_str()?))
    }
}

/// Where parsing gave up.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ParseError {
    pub offset: usize,
    pub message: String,
}

impl fmt::Display for ParseError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{} at byte {}", self.message, self.offset)
    }
}

/// Parse a whole document, rejecting trailing garbage.
pub fn parse(input: &str) -> Result<Json, ParseError> {
    let mut parser = Parser {
        chars: input.chars().collect(),
        pos: 0,
    };

    parser.skip_whitespace();
    let value = parser.value()?;
    parser.skip_whitespace();

    if parser.pos != parser.chars.len() {
        return Err(parser.error("trailing content after document"));
    }

    Ok(value)
}

struct Parser {
    chars: Vec<char>,
    pos: usize,
}

impl Parser {
    fn error(&self, message: &str) -> ParseError {
        ParseError {
            offset: self.pos,
            message: message.to_string(),
        }
    }

    fn peek(&self) -> Option<char> {
        self.chars.get(self.pos).copied()
    }

    fn bump(&mut self) -> Option<char> {
        let next = self.peek();
        if next.is_some() {
            self.pos += 1;
        }

        next
    }

    fn skip_whitespace(&mut self) {
        while matches!(self.peek(), Some(c) if c.is_ascii_whitespace()) {
            self.pos += 1;
        }
    }

    fn expect(&mut self, expected: char) -> Result<(), ParseError> {
        if self.peek() == Some(expected) {
            self.pos += 1;

            return Ok(());
        }

        Err(self.error(&format!("expected {expected:?}")))
    }

    fn value(&mut self) -> Result<Json, ParseError> {
        match self.peek() {
            Some('{') => self.object(),
            Some('[') => self.array(),
            Some('"') => Ok(Json::String(self.string()?)),
            Some('t') | Some('f') => self.boolean(),
            Some('n') => self.null(),
            Some(c) if c == '-' || c.is_ascii_digit() => self.number(),
            _ => Err(self.error("unexpected token")),
        }
    }

    fn object(&mut self) -> Result<Json, ParseError> {
        self.expect('{')?;
        let mut entries = Vec::new();

        self.skip_whitespace();
        if self.peek() == Some('}') {
            self.pos += 1;

            return Ok(Json::Object(entries));
        }

        loop {
            self.skip_whitespace();
            let key = self.string()?;
            self.skip_whitespace();
            self.expect(':')?;
            self.skip_whitespace();
            let value = self.value()?;
            entries.push((key, value));

            self.skip_whitespace();
            match self.bump() {
                Some(',') => continue,
                Some('}') => return Ok(Json::Object(entries)),
                _ => return Err(self.error("expected ',' or '}'")),
            }
        }
    }

    fn array(&mut self) -> Result<Json, ParseError> {
        self.expect('[')?;
        let mut items = Vec::new();

        self.skip_whitespace();
        if self.peek() == Some(']') {
            self.pos += 1;

            return Ok(Json::Array(items));
        }

        loop {
            self.skip_whitespace();
            items.push(self.value()?);

            self.skip_whitespace();
            match self.bump() {
                Some(',') => continue,
                Some(']') => return Ok(Json::Array(items)),
                _ => return Err(self.error("expected ',' or ']'")),
            }
        }
    }

    fn string(&mut self) -> Result<String, ParseError> {
        self.expect('"')?;
        let mut out = String::new();

        loop {
            match self.bump() {
                None => return Err(self.error("unterminated string")),
                Some('"') => return Ok(out),
                Some('\\') => out.push(self.escape()?),
                Some(c) => out.push(c),
            }
        }
    }

    fn escape(&mut self) -> Result<char, ParseError> {
        match self.bump() {
            Some('"') => Ok('"'),
            Some('\\') => Ok('\\'),
            Some('/') => Ok('/'),
            Some('b') => Ok('\u{8}'),
            Some('f') => Ok('\u{c}'),
            Some('n') => Ok('\n'),
            Some('r') => Ok('\r'),
            Some('t') => Ok('\t'),
            Some('u') => self.unicode_escape(),
            _ => Err(self.error("unknown escape")),
        }
    }

    fn unicode_escape(&mut self) -> Result<char, ParseError> {
        let mut code = 0u32;
        for _ in 0..4 {
            let digit = self
                .bump()
                .and_then(|c| c.to_digit(16))
                .ok_or_else(|| self.error("malformed \\u escape"))?;
            code = code * 16 + digit;
        }

        char::from_u32(code).ok_or_else(|| self.error("\\u escape is not a scalar value"))
    }

    fn boolean(&mut self) -> Result<Json, ParseError> {
        if self.starts_with("true") {
            self.pos += 4;

            return Ok(Json::Bool(true));
        }

        if self.starts_with("false") {
            self.pos += 5;

            return Ok(Json::Bool(false));
        }

        Err(self.error("expected a boolean"))
    }

    fn null(&mut self) -> Result<Json, ParseError> {
        if self.starts_with("null") {
            self.pos += 4;

            return Ok(Json::Null);
        }

        Err(self.error("expected null"))
    }

    fn number(&mut self) -> Result<Json, ParseError> {
        let start = self.pos;
        if self.peek() == Some('-') {
            self.pos += 1;
        }

        while matches!(self.peek(), Some(c) if c.is_ascii_digit() || c == '.' || c == 'e' || c == 'E' || c == '+' || c == '-')
        {
            self.pos += 1;
        }

        let raw: String = self.chars[start..self.pos].iter().collect();
        raw.parse::<f64>()
            .map(Json::Number)
            .map_err(|_| self.error("malformed number"))
    }

    fn starts_with(&self, word: &str) -> bool {
        self.chars[self.pos..]
            .iter()
            .take(word.chars().count())
            .copied()
            .eq(word.chars())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_a_nested_document() {
        let doc = parse(r#"{"a": [1, "two", true, null], "b": {"c": "d"}}"#).expect("parses");

        assert_eq!(
            doc.get("a").and_then(Json::as_array).map(<[Json]>::len),
            Some(4)
        );
        assert_eq!(
            doc.get("b").and_then(|b| b.get("c")).and_then(Json::as_str),
            Some("d")
        );
    }

    #[test]
    fn handles_escapes() {
        let doc = parse(r#"{"needle": "let s = \"AT\";\nA"}"#).expect("parses");

        assert_eq!(
            doc.get("needle").and_then(Json::as_str),
            Some("let s = \"AT\";\nA")
        );
    }

    #[test]
    fn rejects_trailing_content() {
        assert!(parse("{} {}").is_err());
    }
}
