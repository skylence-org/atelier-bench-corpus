/**
 * Generic storage contract with two type parameters.
 *
 * `@template` is the only place the parameters exist: implementors pin them in
 * their own JSDoc, so a lookup on `find` must follow the instantiation.
 *
 * @template Id
 * @template Rec
 * @typedef {object} Repository
 * @property {(id: Id) => Rec | undefined} find
 * @property {() => readonly Rec[]} all
 * @property {() => number} count
 */

/**
 * Anything addressable by a numeric id.
 *
 * @typedef {object} Identified
 * @property {number} id
 */

/**
 * Count the records a repository holds without knowing its element type.
 *
 * @template Id
 * @template Rec
 * @param {Repository<Id, Rec>} repository
 * @returns {number}
 */
export function sizeOf(repository) {
    return repository.count();
}
