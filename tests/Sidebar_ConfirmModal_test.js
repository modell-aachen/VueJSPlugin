import ConfirmModal from '../dev/components/sidebar/ConfirmModal.vue';
import TestCase from 'FrontendUnitTestLibrary';

describe("The ConfirmModal component", () => {
  describe("onButtonClick method", () => {
    it("should emit the hide modal event.", () => {
      let modal = TestCase.createVueComponent(ConfirmModal, {});
      spyOn(modal, '$emit');
      modal.onButtonClick({onClick: () => {}});
      expect(modal.$emit).toHaveBeenCalledWith("hide-modal");
    });
    it("should execute the button callback.", () => {
      let modal = TestCase.createVueComponent(ConfirmModal, {});
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
