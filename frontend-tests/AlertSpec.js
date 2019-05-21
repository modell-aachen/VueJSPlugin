import TestCase from '../dev/unit-test-library/main';

describe("Alert Plugin", () => {
    const alertMock = Vue.prototype.$showAlert.mock;

    const showAlert = async function(config) {
        try {
            await Vue.prototype.$showAlert(config);
        } catch (e) {
            return false;
        }
        return true;
    };

    it("should verify that alert was called", TestCase.wrapAsync(async () => {
        await showAlert({
            type: "confirm",
            title: "TestTitle",
            text: "test description",
            confirmButtonText: "Ok",
            cancelButtonText: "Cancel",
        });
        expect(alertMock.config).toEqual(jasmine.objectContaining({
            title: "TestTitle",
            text: "test description",
            confirmButtonText: "Ok",
            cancelButtonText: "Cancel",
        }));
    }));

    it("should confirm dialog by default", TestCase.wrapAsync(async () => {
        const isConfirmed = await showAlert({ type: "confirm" });

        expect(isConfirmed).toBe(true);
    }));

    it("should confirm dialog when confirmed set to true", TestCase.wrapAsync(async () => {
        alertMock.setConfirmationTo(true);
        const isConfirmed = await showAlert({ type: "confirm" });

        expect(isConfirmed).toBe(true);
    }));

    it("should reject dialog when confirmed set to false", TestCase.wrapAsync(async () => {
        alertMock.setConfirmationTo(false);
        const isConfirmed = await showAlert({ type: "confirm" });

        expect(isConfirmed).toBe(false);
    }));

    it("should confirm first and reject second dialog", TestCase.wrapAsync(async () => {
        alertMock.setConfirmationTo([true, false]);

        const areConfirmed = [
            await showAlert({ type: "info" }),
            await showAlert({ type: "error" }),
        ];

        expect(areConfirmed).toEqual([true, false]);
    }));
});
