// DO NOT FIX. Negative case for parsers and indexers.
//
// Unbalanced destructuring patterns and a require call with no argument list
// closed: every binding below is unusable, and the module must fail to parse
// rather than resolve halfway.

const { Dataset, REPORTS = require("@atelier/bench";

const [first, , third = REPORTS;

module.exports = {
    first,
    third,
    seed() {
        const { customers: [ada, grace = Dataset.seeded();

        return ada;
    },
