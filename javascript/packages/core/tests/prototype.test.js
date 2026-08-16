import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { Device, Laptop } from "@atelier/core";
import { Customer } from "@atelier/core";

describe("prototype chain", () => {
    it("hangs methods on the prototype, not on the instance", () => {
        const device = new Device(1, 1, "Framework", "13", "SER-0001");

        assert.equal(device.label(), "Framework 13 (SER-0001)");
        assert.ok(!Object.hasOwn(device, "label"));
        assert.ok(Object.hasOwn(Device.prototype, "label"));
        assert.ok(device.isWarrantyEligible());
    });

    it("inherits through Object.create and reuses the parent with .call", () => {
        const laptop = new Laptop(2, 2, "Lenovo", "X1", "SER-0002", 14);

        assert.ok(laptop instanceof Laptop);
        assert.ok(laptop instanceof Device);
        assert.equal(Object.getPrototypeOf(Laptop.prototype), Device.prototype);
        assert.equal(laptop.label(), 'Lenovo X1 (SER-0002) 14"');
        assert.equal(Device.prototype.label.call(laptop), "Lenovo X1 (SER-0002)");
    });

    it("installs the reference mixin with Object.assign", () => {
        const customer = Customer.seed(1, "Ada Byron", "ada@example.test");

        assert.equal(customer.reference(), "CU-2026-000001");
        assert.ok(!Object.hasOwn(customer, "reference"));
        assert.ok(Object.hasOwn(Customer.prototype, "reference"));
        assert.equal(customer.displayName(), "Ada Byron <ada@example.test>");
    });
});
