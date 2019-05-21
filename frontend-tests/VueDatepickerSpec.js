import VueDatepicker from '../dev/components/vue-datepicker/datepicker';
import TestCase from '../dev/unit-test-library/main';

const createInputForModule = (module, options) => {
    delete module.inject;
    return TestCase.mount(module, options);
};

describe("The datepicker component", () => {
    const createInput = (options) => createInputForModule(VueDatepicker, options);

    describe("with default values", () => {
        const wrapper = createInput();
        it("has correct html structure", () => {
            expect(wrapper.contains('label')).toBe(false);
            expect(wrapper.attributes().disabled).not.toBe('disabled');
        });
    });
    describe("with properties", () => {
        const options = {
            propsData: {
                label: 'TEST',
            },
        };
        const wrapper = createInput(options);
        it("handles label", () => {
            expect(wrapper.contains('label')).toBe(true);
            expect(wrapper.find('label').html()).toContain(options.propsData.label);
        });
    });
    it("handles labelDummy", () => {
        const options = {
            propsData: {
                labelDummy: true,
            },
        };
        const wrapper = createInput(options);
        expect(wrapper.contains('label')).toBe(true);
    });
    describe("when emiting values", () => {
        it("returns an epoch number when initialized with a string", () => {
            const options = {
                propsData: {
                    value: '554385600',
                },
            };
            const wrapper = createInput(options);
            wrapper.vm.internalValue = new Date(123000);
            const events = wrapper.emitted().input;
            expect(events).toEqual([[123]]);
        });
        it("returns an epoch number when initialized with a number", () => {
            const options = {
                propsData: {
                    value: 554385600,
                },
            };
            const wrapper = createInput(options);
            wrapper.vm.internalValue = new Date(123000);
            const events = wrapper.emitted().input;
            expect(events).toEqual([[123]]);
        });
        it("returns a date object when initialized with a date", () => {
            const options = {
                propsData: {
                    value: new Date(554385600),
                },
            };
            const wrapper = createInput(options);
            wrapper.vm.internalValue = new Date(123000);
            const events = wrapper.emitted().input;
            expect(events).toEqual([[new Date(123000)]]);
        });
    });
    describe("when given an initial value", () => {
        it("converts strings to the correct internal date", () => {
            const options = {
                propsData: {
                    value: '554385600',
                },
            };
            const wrapper = createInput(options);
            expect(wrapper.vm.internalValue).toEqual(new Date(554385600000));
        });
        it("converts numbers to the correct internal date", () => {
            const options = {
                propsData: {
                    value: 554385600,
                },
            };
            const wrapper = createInput(options);
            expect(wrapper.vm.internalValue).toEqual(new Date(554385600000));
        });
        it("converts dates to the correct internal date", () => {
            const options = {
                propsData: {
                    value: new Date(554385600000),
                },
            };
            const wrapper = createInput(options);
            expect(wrapper.vm.internalValue).toEqual(new Date(554385600000));
        });
    });
    describe("when initializing the translations", () => {
        const wrapper = createInput({});
        it("picks German when browser is set to 'de'", () => {
            expect(wrapper.vm.getTranslation(['de'])).toBe('de');
        });
        it("picks German when browsers first known language is set to 'de'", () => {
            expect(wrapper.vm.getTranslation(['wuffwuff', 'de', 'en'])).toBe('de');
        });
        it("picks German when browsers first known language is set to 'de' ignoring case and specification", () => {
            expect(wrapper.vm.getTranslation(['wuffwuff', 'DE-CH', 'en'])).toBe('de');
        });
        it("picks English when browsers first known language is set to 'en'", () => {
            expect(wrapper.vm.getTranslation(['mooo', 'en', 'wuffwuff'])).toBe('en');
        });
        it("picks English when browsers is set to no known language", () => {
            expect(wrapper.vm.getTranslation(['mooo', 'wuffwuff'])).toBe('en');
        });
    });
});

