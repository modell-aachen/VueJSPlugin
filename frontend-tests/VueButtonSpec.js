import Button from '../dev/components/vue-button/Button.vue';
import TestCase from '../dev/unit-test-library/main';

let mount = TestCase.mount;
describe("The Button component", () => {
    describe("with default values", () => {
        const wrapper = mount(Button);
        it("renders an empty Button", () => {
            expect(wrapper.classes()).toContain('button');
            expect(wrapper.attributes().disabled).not.toBe('disabled');
            expect(wrapper.find('i').exists()).toBe(false);
        });
    });
    describe("use properties", () => {
        const options = {
            propsData: {
                title: 'TEST',
                type: 'primary',
                color: 'ma-warning-color',
                icon: ['fas','fa-paperclip'],
                isDisabled: true
            }
        };
        const wrapper = mount(Button, options);
        it("title", () => {
            expect(wrapper.text()).toBe(options.propsData.title);
        });
        it("type", () => {
            expect(wrapper.classes()).toContain(options.propsData.type);
        });
        it("color", () => {
            expect(wrapper.classes()).toContain(options.propsData.color);
        });
        it("icon", () => {
            const icon = wrapper.find('i');
            expect(icon.classes()).toContain(options.propsData.icon[1]);
            expect(wrapper.contains('.icon-wrapper')).toBe(true);
        });
        it("isDisabled", () => {
            expect(wrapper.attributes().disabled).toBe('disabled');
        });
    });
    describe("propertie validation is correct", () => {
        const wrapper = mount(Button);
        it("for type", () => {
            expect(wrapper.vm.$options.props.type.validator('no type')).toBe(false);
            expect(wrapper.vm.$options.props.type.validator('primary')).toBe(true);
            expect(wrapper.vm.$options.props.type.validator('')).toBe(true);
        });
        it("for color", () => {
            expect(wrapper.vm.$options.props.color.validator('no color')).toBe(false);
            expect(wrapper.vm.$options.props.color.validator('ma-warning-color')).toBe(true);
            expect(wrapper.vm.$options.props.color.validator('')).toBe(true);
        });
        it("for alignment", () => {
            expect(wrapper.vm.$options.props.alignment.validator('wrong alignment')).toBe(false);
            expect(wrapper.vm.$options.props.alignment.validator('')).toBe(false);
            expect(wrapper.vm.$options.props.alignment.validator('center')).toBe(true);
            expect(wrapper.vm.$options.props.alignment.validator('left')).toBe(true);
            expect(wrapper.vm.$options.props.alignment.validator('right')).toBe(true);
        });
    });

    describe("property is corretly rendered", () => {

        let options = {
            propsData: {
                title: 'TEST',
                type: 'primary',
            }
        };

        it("for alignment default/none", () => {
            const wrapper = mount(Button, options);
            expect(wrapper.classes()).toContain('text-center');
        });

        it("for alignment center", () => {
            options.propsData.alignment = 'center';
            const wrapper = mount(Button, options);
            expect(wrapper.classes()).toContain('text-center');
        });

        it("for alignment left", () => {
            options.propsData.alignment = 'left';
            const wrapper = mount(Button, options);
            expect(wrapper.classes()).toContain('text-left');
        });

        it("for alignment right", () => {
            options.propsData.alignment = 'right';
            const wrapper = mount(Button, options);
            expect(wrapper.classes()).toContain('text-right');
        });
    });
});

