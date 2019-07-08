import ConfirmModal from '../dev/components/sidebar/ConfirmModal.vue';
import TestCase from '../dev/unit-test-library/main';

describe("The ConfirmModal component", () => {
    describe("onButtonClick method", () => {
        const options = {
            propsData: {
                config: {},
            },
        };
        it("should emit the hide modal event.", () => {
            let modal = TestCase.createVueComponent(ConfirmModal, options);
            spyOn(modal, '$emit');
            modal.onButtonClick({onClick: () => {}});
            expect(modal.$emit).toHaveBeenCalledWith("hide-modal");
        });
        it("should execute the button callback.", () => {
            let modal = TestCase.createVueComponent(ConfirmModal, options);
            let onClickSpy = jasmine.createSpy('onClick');
            modal.onButtonClick({onClick: onClickSpy});
            expect(onClickSpy).toHaveBeenCalled();
        });
    });
    describe("description", () => {
        it("should be an array when initilized with an array.", () => {
            let modal = TestCase.createVueComponent(ConfirmModal, {propsData:{config: {description: ["Foo","Bar"]}}});
            expect(modal.description).toEqual(["Foo","Bar"]);
        });
        it("should be an array with one element when initilized with a string.", () => {
            let modal = TestCase.createVueComponent(ConfirmModal, {propsData:{config: {description: "Test"}}});
            expect(modal.description).toEqual(["Test"]);
        });
    });
});
