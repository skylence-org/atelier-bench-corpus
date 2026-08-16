/** Customer record. */

import { withReference } from "../concerns/hasReference.js";

/**
 * Owner of one or more devices.
 *
 * `reference()` comes from the mixin installed at the foot of this file, not
 * from the class body.
 */
export class Customer {
    /**
     * @param {number} id
     * @param {string} name
     * @param {string} email
     * @param {string} [phone]
     */
    constructor(id, name, email, phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    /**
     * Display name used in tables and the report header.
     *
     * @returns {string}
     */
    displayName() {
        return `${this.name} <${this.email}>`;
    }

    /** @returns {boolean} */
    isReachable() {
        return this.phone !== undefined || this.email !== "";
    }

    /**
     * @param {number} id
     * @param {string} name
     * @param {string} email
     * @param {string} [phone]
     * @returns {Customer}
     */
    static seed(id, name, email, phone) {
        const customer = new Customer(id, name, email, phone);
        customer.referenceNumber = id;

        return customer;
    }
}

withReference(Customer, "CU");
