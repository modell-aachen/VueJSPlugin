import RealNumberInput from '../dev/components/vue-input-real-number/InputRealNumber.vue';
import TextInput from '../dev/components/vue-input-text/InputText.vue';
import TestCase from '../dev/unit-test-library/main';


const createInputForModule = (module, options) => {
    delete module.inject;
    return TestCase.mount(module, options);
};

const components = [
    {
        name: 'RealNumberInput',
        module: RealNumberInput,
    },
    {
        name: 'TextInput',
        module: TextInput,
    },
];
describe("The Input components", () => {
    components.forEach(component => {
        const createInput = (options) => createInputForModule(component.module, options);

        describe(`implemented by ${component.name}`, () => {
            describe("with default values", () => {
                const wrapper = createInput();
                it("has correct html structure", () => {
                    expect(wrapper.contains('label')).toBe(false);
                    expect(wrapper.contains('input')).toBe(true);
                    expect(wrapper.attributes().disabled).not.toBe('disabled');
                });
            });
            describe("uses property", () => {
                const options = {
                    propsData: {
                        label: 'TEST',
                        name: 'test-input',
                        placeholder: 'PLACEHOLDER',
                        icon: ['fas','fa-paperclip'],
                        isSmall: true,
                        isDisabled: true,
                    }
                };
                const wrapper = createInput(options);
                it("label", () => {
                    expect(wrapper.contains('label')).toBe(true);
                    expect(wrapper.find('label').html()).toContain(options.propsData.label);
                });
                it("name", () => {
                    expect(wrapper.find('input').attributes().name).toBe(options.propsData.name);
                });
                it("placeholder", () => {
                    expect(wrapper.find('input').attributes().placeholder).toBe(options.propsData.placeholder);
                });
                it("icon", () => {
                    expect(wrapper.find('i').classes()).toContain(options.propsData.icon[1]);
                });
                it("isSmall", () => {
                    expect(wrapper.find('input').classes()).toContain('ma-small');
                });
                it("isDisabled", () => {
                    expect(wrapper.find('input').attributes().disabled).toBe('disabled');
                });
            });
            describe("send typed event", () => {
                const options = {
                    propsData: {
                        name: 'test-input',
                        validate: 'email'
                    }
                };
                const wrapper = createInput(options);
                it("every time data changes", () => {
                    wrapper.setData({data: '1'});
                    wrapper.setData({data: '2'});
                    wrapper.setData({data: '3'});
                    const events = wrapper.emitted().input;
                    expect(events.length).toBe(3);
                });
                it("with correct data", () => {
                    wrapper.setData({data: '1234'});
                    const events = wrapper.emitted().input;
                    expect(events[events.length - 1][0]).toBe('1234');
                });
            });
        });
    });
});

