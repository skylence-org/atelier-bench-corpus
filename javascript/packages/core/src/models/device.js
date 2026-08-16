/**
 * Device brought in for repair.
 *
 * The only model written the old way: a constructor function plus methods
 * hung on `Device.prototype`, with `Laptop` inheriting through
 * `Object.create(Device.prototype)`. No `class` keyword appears in this file,
 * so every method here is a prototype property, not a class member.
 */

/**
 * @param {number} id
 * @param {number} customerId
 * @param {string} brand
 * @param {string} model
 * @param {string} [serial]
 */
export function Device(id, customerId, brand, model, serial) {
    this.id = id;
    this.customerId = customerId;
    this.brand = brand;
    this.model = model;
    this.serial = serial;
}

/**
 * Human label such as `Framework 13 (SER-0001)`.
 *
 * @returns {string}
 */
Device.prototype.label = function label() {
    return this.serial === undefined
        ? `${this.brand} ${this.model}`
        : `${this.brand} ${this.model} (${this.serial})`;
};

/**
 * Devices without a serial cannot be warranty-claimed.
 *
 * @returns {boolean}
 */
Device.prototype.isWarrantyEligible = function isWarrantyEligible() {
    return this.serial !== undefined;
};

/**
 * Laptop subtype.
 *
 * Inheritance is wired by hand: the parent constructor runs through `.call`
 * with a rebound `this`, and the prototype chain is built with `Object.create`.
 *
 * @param {number} id
 * @param {number} customerId
 * @param {string} brand
 * @param {string} model
 * @param {string | undefined} serial
 * @param {number} screenInches
 */
export function Laptop(id, customerId, brand, model, serial, screenInches) {
    Device.call(this, id, customerId, brand, model, serial);
    this.screenInches = screenInches;
}

Laptop.prototype = Object.create(Device.prototype);
Laptop.prototype.constructor = Laptop;

/**
 * Overrides the parent label and reuses it through an explicit `.call`.
 *
 * @returns {string}
 */
Laptop.prototype.label = function label() {
    return `${Device.prototype.label.call(this)} ${this.screenInches}"`;
};
