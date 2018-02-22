import TabButton from '../dev/components/sidebar/TabButton.vue';
import TestCase from '../dev/unit-test-library/main';

describe("The TabButton component", () => {
  describe("isCloseButton", () => {
    it("should return true, when the button is a close button.", () => {
      let closeButton = TestCase.createVueComponent(TabButton, {propsData: {icon: 'fa-times', tooltip: 'close', type: 'close'}});
      expect(closeButton.isCloseButton).toEqual(true);
    });
    it("should return false, when the button isn't a close button.", () => {
      let closeButton = TestCase.createVueComponent(TabButton, {propsData: {icon: 'fa-times', tooltip: 'close', type: 'open'}});
      expect(closeButton.isCloseButton).toEqual(false);
    });
  });
  describe("isActive prob", () => {
    it("should be inactive when prob is false.", () => {
      let tabButton = TestCase.createVueComponent(TabButton, {propsData: {icon: 'fa-times', tooltip: 'tab1', isActive: false}});
      expect(tabButton.isActive).toEqual(false);
    });
  });
  describe("click function", () => {
    it("should emit 'click' event.", () => {
      let tabButton = TestCase.createVueComponent(TabButton, {propsData: {icon: 'fa-times', tooltip: 'tab1', isActive: false}});
      spyOn(tabButton, '$emit');
      tabButton.click();
      expect(tabButton.$emit).toHaveBeenCalledWith("click");
    });
  });
});
