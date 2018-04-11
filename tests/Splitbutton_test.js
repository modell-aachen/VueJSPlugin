import Splitbutton from '../dev/components/vue-splitbutton/Splitbutton.vue';
import TestCase from '../dev/unit-test-library/main';

describe("The Splitbutton component", () => {
  let splitbuttonWrapper;
  let mainButtonCallback = jasmine.createSpy("main button click");
  beforeEach(() => {
    splitbuttonWrapper = TestCase.mount(Splitbutton, {
      propsData: {
        mainButtonTitle: "Main button",
        onMainButtonClick: mainButtonCallback,
        dropdownButtonTitle: "Dropdown button"
      },
      slots: {
        "dropdown-content": "<div class='slot-content'>Slot content</div>"
      }
    });
  });

  it("shows a main button with the main button title", () => {
    const mainButton = splitbuttonWrapper.find(".main-button");
    expect(mainButton.text()).toBe("Main button");
  });

  it("calls the main button callback when the main button is clicked", () => {
    const mainButton = splitbuttonWrapper.find(".main-button");
    mainButton.trigger('click');
    expect(mainButtonCallback).toHaveBeenCalled();
  });

  it("starts with a closed dropdown", () => {
    const dropdown = splitbuttonWrapper.find(".vue-splitbutton-dropdown");
    expect(dropdown.isVisible()).toBe(false);
  });

  it("opens and closes the dropdown when clicked on the dropdown button", () => {
    const dropdownButton = splitbuttonWrapper.find(".dropdown-button");
    const dropdown = splitbuttonWrapper.find(".vue-splitbutton-dropdown");

    dropdownButton.trigger("click");
    expect(dropdown.isVisible()).toBe(true);

    dropdownButton.trigger("click");
    expect(dropdown.isVisible()).toBe(false);
  });

  it("closes the dropdown when clicking outside", () => {
    const dropdownButton = splitbuttonWrapper.find(".dropdown-button");
    const dropdown = splitbuttonWrapper.find(".vue-splitbutton-dropdown");
    dropdownButton.trigger('click');

    document.documentElement.click();

    expect(dropdown.isVisible()).toBe(false);
  });

  it("shows the content provided by the dropdown-content slot inside the dropdown", () => {
    const dropdownSlotContent = splitbuttonWrapper.find(".vue-splitbutton-dropdown .slot-content");

    expect(dropdownSlotContent.exists()).toBe(true);
  });
});

