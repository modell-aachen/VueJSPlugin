import MixedInput from '../dev/components/vue-mixed-input/MixedInput';
import TestCase from '../dev/unit-test-library/main';

describe("The mixed input component", () => {
    let mixedInput;
    const options = [{
        id: "option-1",
        label: "a"
    },{
        id: "option-2",
        label: "c"
    },{
        id: "option-3",
        label: "b"
    },];
    const clickOnMainInput = async () => {
        return new Promise((resolve) => {
            mixedInput.find({ref: 'input-root'}).trigger('click');
            Vue.nextTick(() => {
                resolve();
            });
        });
    };

    const clickOnOption = async (index) => {
        return new Promise((resolve) => {
            const optionClickers = mixedInput.findAll({ref: "option-clickers"});
            optionClickers.wrappers[index].trigger("mousedown");
            Vue.nextTick(() => {
                resolve();
            });
        });
    };

    const getDropdown = () => {
        return mixedInput.find({ref: 'dropdown'});
    };

    const getOptionLabels = () => {
        const optionLabelElements = mixedInput.findAll({ref: 'option-labels'});
        return optionLabelElements.wrappers.map((labelWrapper) => {
            return labelWrapper.text();
        });
    };
    const getLastEmittedModel = () => {
        const inputEmits = mixedInput.emitted().input;
        return inputEmits[inputEmits.length - 1][0];
    };

    const getFocusedElement = () => {
        return mixedInput.findAll({ref: "inputs"}).wrappers[Math.ceil(mixedInput.vm.focusedItemIndex / 2)];
    };

    const typeText = async (input) => {
        getFocusedElement().element.value = input;
        getFocusedElement().trigger('input');
        await moveCursorToPosition(input.length);
    };

    const moveCursorToPosition = async (pos) => {
        getFocusedElement().element.setSelectionRange(pos, pos);
    };

    beforeEach(() => {
        mixedInput = TestCase.mount(MixedInput, {
            propsData: {
                options
            }
        });
    });

    afterEach(() => {
        mixedInput.destroy();
    });

    it("does not show its dropdown when initialized", () => {
        expect(getDropdown().isVisible()).toBe(false);
    });
    it("shows the dropdown when clicked on the input area", TestCase.wrapAsync(async () => {
        await clickOnMainInput();
        expect(getDropdown().isVisible()).toBe(true);
    }));
    it("shows the defined options in the dropdown in the order they are defined", TestCase.wrapAsync(async () => {
        await clickOnMainInput();
        expect(getOptionLabels()).toEqual(["a","c","b"]);
    }));
    it("adds one selected option to the value", TestCase.wrapAsync(async () => {
        await clickOnMainInput();
        await clickOnOption(1);
        expect(getLastEmittedModel()).toEqual([{type: "option", id: "option-2"}]);
    }));
    it("adds two selected options to the value in the correct order", TestCase.wrapAsync(async () => {
        await clickOnMainInput();
        await clickOnOption(1);
        await clickOnOption(0);
        expect(getLastEmittedModel()).toEqual([{type: "option", id: "option-2"},{type: "option", id: "option-1"}]);
    }));
    it("allows input of text when clicking on it", TestCase.wrapAsync(async () => {
        await clickOnMainInput();
        await typeText("abcd");
        expect(getLastEmittedModel()).toEqual([{type: "text", value: "abcd"}]);
    }));
    it("allows mixing text with options", TestCase.wrapAsync(async () => {
        await clickOnMainInput();
        await typeText("test123");
        await clickOnOption(2);
        expect(getLastEmittedModel()).toEqual([{type: "text", value: "test123"}, {type: "option", id: "option-3"}]);
    }));
    it("puts selected items before the text if the input cursor is at start", TestCase.wrapAsync(async () => {
        await clickOnMainInput();
        await typeText("test123");
        await moveCursorToPosition(0);
        await clickOnOption(2);
        expect(getLastEmittedModel()).toEqual([{type: "option", id: "option-3"}, {type: "text", value: "test123"}]);
    }));
    it("puts selected items in between texts if cursor is in between the text", TestCase.wrapAsync(async () => {
        await clickOnMainInput();
        await typeText("test123");
        await moveCursorToPosition(4);
        await clickOnOption(2);
        expect(getLastEmittedModel()).toEqual([{type: "text", value: "test"}, {type: "option", id: "option-3"}, {type: "text", value: "123"}]);
    }));
    it("automatically merges text input data when provided from outside", TestCase.wrapAsync(async () => {
        mixedInput.setProps({
            value: [{
                type: "text",
                value: "ab"
            },{
                type: "option",
                id: "option-3"
            },{
                type: "text",
                value: "cd"
            },{
                type: "text",
                value: "ef"
            }]
        });
        expect(getLastEmittedModel()).toEqual([{
            type: "text",
            value: "ab"
        },{
            type: "option",
            id: "option-3"
        },{
            type: "text",
            value: "cdef"
        }]);
    }));
});
