import CheckItem from '../dev/components/vue-check-item/CheckItem.vue';
import TestCase from '../dev/unit-test-library/main';

let mount = TestCase.mount;
describe("The CheckItem component", () => {
    describe("with default values", () => {
        const wrapper = mount(CheckItem);
        it("renders an empty Checkbox", () => {
            const input = wrapper.find('input');
            expect(input.attributes().type).toBe('checkbox');
            expect(wrapper.classes()).toContain('ma-switch');
            expect(wrapper.attributes().disabled).not.toBe('disabled');
            expect(wrapper.find('label').exists()).toBe(true);
        });
    });
    describe("model updates", () => {
        let wrapper;
        beforeEach(() => {
            const options = {
                propsData: {
                    name: 'test[]',
                    value: 'Foo',
                    checked: true,
                    modelValue: ['Foo'],
                },
            };
            wrapper = mount(CheckItem, options);
        });
        it("when changing prop", () => {
            expect(wrapper.vm.state).toBe(true);
            expect(wrapper.vm.modelValue).toContain('Foo');
            wrapper.setProps({modelValue: []});
            expect(wrapper.vm.state).toBe(false);
        });
    });
    describe("label", () => {
        describe("dummy", () => {
            it("is generated, when asked for", () => {
                let wrapper = TestCase.mount(CheckItem, {propsData: { labelDummy: true }});
                expect(wrapper.contains('.input-label.label-dummy')).toBe(true);
            });
            it("is not generated, when no label-dummy", () => {
                let wrapper = TestCase.mount(CheckItem, {});
                expect(wrapper.contains('.label-dummy')).toBe(false);
            });
            it("is not generated, when label-dummy but label-property is provided as well", () => {
                let wrapper = TestCase.mount(CheckItem, {propsData: { labelDummy: true, label: 'a checkbox' }});
                expect(wrapper.contains('.label-dummy')).toBe(false);
            });
        });
    });
});

