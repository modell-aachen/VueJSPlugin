import Modal from '../dev/components/sidebar/Modal.vue';
import TestCase from '../dev/unit-test-library/main';

describe("The Modal component", () => {
  it("shuld emit hide modal event.", () => {
    let modal = TestCase.createVueComponent(Modal, {});
    spyOn(modal, '$emit');
    modal.hideModal();
    expect(modal.$emit).toHaveBeenCalledWith("hide-modal");
  });
});
