import ExplanationTooltip from '../dev/components/vue-tooltip/ExplanationTooltip';
import InformationTooltip from '../dev/components/vue-tooltip/InformationTooltip';
import TestCase from '../dev/unit-test-library/main';

let mount = TestCase.mount;
describe("The ExplanationTooltip component", () => {
    describe("with default values", () => {
        const wrapper = mount(ExplanationTooltip);
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
            },
        };
        const wrapper = mount(ExplanationTooltip, options);
        it("text", () => {
            expect(wrapper.contains('span.trigger')).toBeTruthy;
        });
        it("icon", () => {
            expect(wrapper.find('i').classes()).toContain(options.propsData.icon[1]);
        });
    });
});

describe("The InformationTooltip component", () => {
    describe("use properties", () => {
        const options = {
            propsData: {
                hoverText: 'TEST?',
            },
        };
        const wrapper = mount(InformationTooltip, options);
        it("hover text with correct class for styling", () => {
            expect(wrapper.find('.tooltip-description-text').text()).toBe('TEST?');
        });
    });
});
