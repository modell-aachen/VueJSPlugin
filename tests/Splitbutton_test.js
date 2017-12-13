import Splitbutton from '../dev/components/vue-splitbutton/Splitbutton.vue';
import TestCase from 'FrontendUnitTestLibrary';

describe("The Splitbutton component", () => {
  jasmine.clock().install(); // XXX usually you would uninstall the clock after each test, however in conjunction with setTimeout this has a habit to break

  describe("has a dropdown which", () => {
    beforeEach(() => {
      jasmine.clock().mockDate();
    });

    it("should appear when the chevron is being clicked (and it is closed)", () => {
      let button = TestCase.createVueComponent(Splitbutton, {});
      button.toggleSplitOpen();
      expect(button.splitOpen).toBe(true);
    });

    it("should close when the chevron is being clicked (and it is open)", () => {
      let button = TestCase.createVueComponent(Splitbutton, {});
      button.splitOpen = true;
      button.toggleSplitOpen();
      expect(button.splitOpen).toBe(false);
    });

    it("should emit 'action' when the button text is being pressed", () => {
      let button = TestCase.createVueComponent(Splitbutton, {});
      let spy = spyOn(button, '$emit');
      button.callAction();
      let callArgs = spy.calls.allArgs();
      expect(callArgs.length).toBe(1);
      expect(callArgs[0][0]).toBe('action');
    });

    it("should close when the mouse leaves", () => {
      let button = TestCase.createVueComponent(Splitbutton, {});
      button.splitOpen = true;

      spyOn(window, 'setTimeout').and.callFake((callBack, timeout) => {
        jasmine.clock().tick(timeout + 5);
        callBack();
      });

      button.mouseEnter();
      button.mouseLeave();

      expect(button.splitOpen).toBe(false);
    });

    it("should not close when the mouse leaves and enters again", () => {
      let button = TestCase.createVueComponent(Splitbutton, {});
      button.splitOpen = true;

      spyOn(window, 'setTimeout').and.callFake((callBack, timeout) => {
        jasmine.clock().tick(timeout / 2);

        button.mouseEnter();

        jasmine.clock().tick(timeout / 2 + 5);
        callBack();
      });

      button.mouseEnter();
      button.mouseLeave();

      expect(button.splitOpen).toBe(true);
    });
  });
});

