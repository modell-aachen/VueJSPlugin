import RealNumberInput from '../dev/components/vue-input-real-number/InputRealNumber';
import TestCase from '../dev/unit-test-library/main';


const createInput = (options) => {
    delete RealNumberInput.inject;
    return TestCase.mount(RealNumberInput, options);
};

describe("The Real Number Input component", () => {
    let wrapper;

    let formatChecks = [
        {
            description: "letters",
            input: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            value: "",
            displayValue: "",
        },
        {
            description: "common special characters",
            input: '°^!"§$%&/()=?`\'*#ÜÄÖ_:;€µ\u{1f984}',
            value: "",
            displayValue: '',
        },
        {
            description: "any numerals",
            input: '9876543210',
            value: "9876543210",
            displayValue: '9876543210',
        },
        {
            description: "negative numbers",
            input: '-100',
            value: '-100',
            displayValue: '-100',
        },
        {
            description: "minusses when not at the beginning",
            input: '9-8',
            value: '98',
            displayValue: '98',
        },
        {
            description: "consecutive and leading spaces",
            input: ' -  9  8 7  ',
            displayValue: '- 9 8 7 ',
            value: '-987',
        },
        {
            description: "consecutive dots and commas",
            input: '9,,8..7.,6,.5,.,4.,.3 , 2, .1. 0',
            displayValue: '9,  8.7,6,5,4,3 , 2, 1. 0',
            value: '9.87654321',
        },
        {
            description: "dot as separator with no comma present",
            input: '9.8',
            displayValue: '9.  8',
            value: '9.8',
        },
        {
            description: "two dots as separator with no comma present",
            input: '9.8.7',
            displayValue: '9.8.7',
            value: '987',
        },
        {
            description: "comma as separator, even with dot present",
            input: '9.8,1',
            displayValue: '9.8,  1',
            value: '98.1',
        },
    ];

    const cursorChecks = [
        {
            description: "appending to number",
            input: '123se',
            displayValue: '123se',
        },
        {
            description: "prepending to number",
            input: 'se312',
            displayValue: 'se3123',
        },
        {
            description: "adding in the middle",
            input: '1236se45',
            displayValue: '1236se45',
        },
        {
            description: "typing invalid character",
            input: '1236xse45',
            displayValue: '1236se45',
        },
        {
            description: "removing the decimal marker",
            input: '123. se45',
            displayValue: '123se45',
        },
        {
            description: "removing the decimal marker in between",
            input: '123.se 45',
            displayValue: '123se45',
        },
        {
            description: "removing the decimal marker (comma)",
            input: '123, se45',
            displayValue: '123se45',
        },
        {
            description: "removing the decimal marker in between (comma)",
            input: '123,se 45',
            displayValue: '123se45',
        },
    ];

    describe("input field", () => {
        const options = {
            propsData: {
                name: 'test-input',
            }
        };
        beforeEach(() => {
            wrapper = createInput(options);
        });
        cursorChecks.forEach((check) => {
            describe('when ' + check.description, () => {
                it("moves the cursor correctly", () => {
                    const newInput = check.input.replace(/[se]/g , '');
                    const newCursorStart = check.displayValue.indexOf('s');
                    const newCursorEnd = check.displayValue.indexOf('e') - 1;
                    wrapper.vm.$refs.input.value = newInput;
                    wrapper.vm.$refs.input.selectionStart = newCursorStart;
                    wrapper.vm.$refs.input.selectionEnd = newCursorEnd;
                    wrapper.setData({data: newInput});
                    return Vue.nextTick().then(() => {
                        expect(wrapper.vm.$refs.input.selectionStart).toBe(newCursorStart);
                        expect(wrapper.vm.$refs.input.selectionEnd).toBe(newCursorEnd);
                    });
                });
            });
        });
        formatChecks.forEach((check) => {
            describe('when receiving' + check.description, () => {
                it("applies the correctly filtered string", () => {
                    wrapper.setData({data: check.input});
                    expect(wrapper.vm.displayValue).toBe(check.displayValue);
                });
                it("emits the correct number as a string", () => {
                    wrapper.setData({data: check.input});
                    const events = wrapper.emitted().input;
                    const lastEvent = events[events.length - 1][0];
                    expect(lastEvent).toBe(check.value);
                });
            });
        });
    });
});

