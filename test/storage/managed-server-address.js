import {beforeEach} from "mocha";
import sinon from "sinon";
import {storage} from "../../chrome-extension/storage/index.js";
import {browser} from "../../chrome-extension/browser.js";
import {DEFAULT_SERVER_ADDRESS} from "../../chrome-extension/constants.js";
import assert from "node:assert";

describe("Managed server address", function () {

    beforeEach(function () {
        sinon.restore();
    });

    it("returns managed value when present, ignoring local value", async function () {
        sinon.replace(browser, "retrieveManagedKey", sinon.fake.resolves("https://managed.example.com:5743"));
        sinon.replace(browser, "retrieveKey", sinon.fake.resolves("https://local.example.com:5743"));

        const result = await storage.retrieveServerAddress();

        assert.strictEqual(result, "https://managed.example.com:5743");
        sinon.assert.calledOnce(browser.retrieveManagedKey);
        sinon.assert.calledWithExactly(browser.retrieveManagedKey, "serverAddress");
    });

    it("falls back to local storage when managed is not set", async function () {
        sinon.replace(browser, "retrieveManagedKey", sinon.fake.resolves(undefined));
        sinon.replace(browser, "retrieveKey", sinon.fake.resolves("https://local.example.com:5743"));

        const result = await storage.retrieveServerAddress();

        assert.strictEqual(result, "https://local.example.com:5743");
        sinon.assert.calledOnce(browser.retrieveManagedKey);
        sinon.assert.calledOnce(browser.retrieveKey);
    });

    it("falls back to default when both managed and local are absent", async function () {
        sinon.replace(browser, "retrieveManagedKey", sinon.fake.resolves(undefined));
        sinon.replace(browser, "retrieveKey", sinon.fake.resolves(undefined));

        const result = await storage.retrieveServerAddress();

        assert.strictEqual(result, DEFAULT_SERVER_ADDRESS);
    });

    it("falls back to local storage when managed returns empty string", async function () {
        sinon.replace(browser, "retrieveManagedKey", sinon.fake.resolves(""));
        sinon.replace(browser, "retrieveKey", sinon.fake.resolves("https://local.example.com:5743"));

        const result = await storage.retrieveServerAddress();

        assert.strictEqual(result, "https://local.example.com:5743");
    });

    it("falls back to local storage when managed returns null", async function () {
        sinon.replace(browser, "retrieveManagedKey", sinon.fake.resolves(null));
        sinon.replace(browser, "retrieveKey", sinon.fake.resolves("https://local.example.com:5743"));

        const result = await storage.retrieveServerAddress();

        assert.strictEqual(result, "https://local.example.com:5743");
    });

    it("isServerAddressManaged returns true when managed value is set", async function () {
        sinon.replace(browser, "retrieveManagedKey", sinon.fake.resolves("https://managed.example.com:5743"));

        const result = await storage.isServerAddressManaged();

        assert.strictEqual(result, true);
        sinon.assert.calledWithExactly(browser.retrieveManagedKey, "serverAddress");
    });

    it("isServerAddressManaged returns false when managed value is undefined", async function () {
        sinon.replace(browser, "retrieveManagedKey", sinon.fake.resolves(undefined));

        const result = await storage.isServerAddressManaged();

        assert.strictEqual(result, false);
    });

    it("isServerAddressManaged returns false when managed value is empty string", async function () {
        sinon.replace(browser, "retrieveManagedKey", sinon.fake.resolves(""));

        const result = await storage.isServerAddressManaged();

        assert.strictEqual(result, false);
    });

    it("isServerAddressManaged returns false when managed value is null", async function () {
        sinon.replace(browser, "retrieveManagedKey", sinon.fake.resolves(null));

        const result = await storage.isServerAddressManaged();

        assert.strictEqual(result, false);
    });
});
