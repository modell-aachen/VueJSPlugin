import Tooltip from '../dev/components/vue-tooltip/Tooltip.vue';
import TestCase from '../dev/unit-test-library/main';

let mount = TestCase.mount;
describe("The Tooltip component", () => {
    describe("with default values", () => {
        const wrapper = mount(Tooltip);
        it("renders an empty tooltip icon", () => {
            expect(wrapper.find('i').exists()).toBe(true);
            expect(wrapper.find('i').classes()).toContain('tooltip-icon');
        });
    });
    describe("use properties", () => {
        const options = {
            propsData: {
                text: 'TEST',
                icon: ['fas','fa-paperclip'],
            }
        };
        const wrapper = mount(Tooltip, options);
        it("text", () => {
            expect(wrapper.classes()).toContain('has-tooltip');
        });
        it("icon", () => {
            expect(wrapper.find('i').classes()).toContain(options.propsData.icon[1]);
        });
    });
});

