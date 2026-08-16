const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { describe, it } = require("node:test");

const { Dataset } = require("@atelier/bench");
const { Formatter: StatusFormatter } = require("@atelier/core/reporting");
const { Money } = require("@atelier/core");
const { EmailNotifier } = require("@atelier/bench/notifiers/emailNotifier.cjs");
const { Stamped } = require("@atelier/bench/concerns/hasTimestamps.cjs");
const { MetadataBag } = require("@atelier/bench/concerns/hasMetadata.cjs");

describe("commonjs reaching an esm package", () => {
    it("requires the ESM core from a .cjs module", () => {
        const data = Dataset.seeded();

        assert.equal(data.customers.length, 3);
        assert.equal(data.orders[0].reference(), "AT-2026-000001");
        assert.equal(new Money(1).cents, 1);
    });

    it("aliases the shadow pair at the require site", () => {
        const status = new StatusFormatter("nl");

        assert.equal(status.localeTag(), "nl");
        assert.equal(status.statusLine("completed"), "Completed");
        assert.equal(typeof status.money, "undefined");
    });
});

describe("iterating the dataset", () => {
    it("walks orders through Symbol.iterator", () => {
        const data = Dataset.seeded();
        const ids = [];

        for (const order of data) {
            ids.push(order.id);
        }

        assert.deepEqual(ids, [1, 2, 3, 4]);
        assert.equal([...data].length, 4);
        assert.equal([...data.ordersOf(1)].length, 2);
    });
});

describe("this rebinding", () => {
    it("keeps the arrow bound and needs .call for the plain function", () => {
        const notifier = new EmailNotifier();

        assert.deepEqual(notifier.describeAll(["ready"]), ["email:ready EMAIL:ready"]);
    });

    it("hands out a sender that survives detachment", () => {
        const send = new EmailNotifier().boundSender();

        assert.equal(send("subject", "body").channel, "email");
    });
});

describe("shared concerns", () => {
    it("stamps a payload against a frozen epoch", () => {
        const stamped = new Stamped({ slug: "gross-profit" });

        assert.equal(stamped.createdAt().toISOString(), "2026-07-16T08:00:00.000Z");
        assert.equal(stamped.ageSeconds(new Date(Stamped.FROZEN_EPOCH_SECONDS * 1000 + 60000)), 60);
        assert.equal(stamped.updatedAt(), undefined);
    });

    it("keeps metadata in insertion order", () => {
        const bag = new MetadataBag().set("lane", "javascript").set("seed", "frozen");

        assert.deepEqual(bag.metaKeys(), ["lane", "seed"]);
        assert.equal(bag.meta("lane"), "javascript");
    });
});

describe("package specifiers", () => {
    // A specifier used only inside a JSDoc @type {import("...")} is never executed,
    // so an incomplete "exports" map stays invisible to the tests and to node --check.
    // This sweep is the only place that resolves every @atelier specifier in the lane.
    it("resolves every @atelier specifier written anywhere in the sources", () => {
        const packagesDir = path.join(__dirname, "..", "..");
        const files = [];

        const walk = (dir) => {
            for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                const full = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    if (entry.name !== "node_modules") walk(full);
                } else if (/\.(c?js)$/.test(entry.name)) {
                    files.push(full);
                }
            }
        };

        walk(packagesDir);

        const specifiers = new Set();

        for (const file of files) {
            const source = fs.readFileSync(file, "utf8");

            for (const match of source.matchAll(/@atelier\/[A-Za-z0-9._/-]+/g)) {
                specifiers.add(match[0].replace(/\.+$/, ""));
            }
        }

        const unresolvable = [];

        for (const specifier of specifiers) {
            try {
                require.resolve(specifier, { paths: [__dirname] });
            } catch (error) {
                unresolvable.push(`${specifier} (${error.code})`);
            }
        }

        assert.deepEqual(unresolvable, []);
        assert.ok(specifiers.size >= 25, `only ${specifiers.size} specifier(s) swept`);
    });
});
