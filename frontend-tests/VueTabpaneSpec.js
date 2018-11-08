import TabPane from '../dev/components/vue-tabpane/TabPane.vue';
import TestCase from '../dev/unit-test-library/main';

let mount = TestCase.mount;
describe("The TabPane component", () => {
    let wrapper;
    beforeEach((done) => {
    // Pops default for id in vue-tab is undefined, so we need to define id.
        const options = {
            slots:  {
                default: `<vue-tab name="eins">Content1</vue-tab>
                  <vue-tab name="zwei">Content2</vue-tab>
                  <vue-tab name="drei">Content3</vue-tab>`,
            }
        };
        wrapper = mount(TabPane, options);
        Vue.nextTick(() => {
            done();
        });
    });
    describe("with default values", () => {
        it("renders a TabPane", () => {
            expect(wrapper.contains('div')).toBe(true);
            expect(wrapper.classes()).toContain('vue-tabpane');
        });
        it("displays Tabs", () => {
            const allTabs = wrapper.findAll('.vue-tab');
            expect(allTabs.length).toBe(3);
            const allTabTitles = wrapper.findAll('li');
            expect(allTabTitles.length).toBe(3);
        });
        it("shows first tab", () => {
            const allTabs = wrapper.findAll('.vue-tab');
            const activeTabs = allTabs.filter(tab => tab.isVisible());
            expect(activeTabs.length).toBe(1);
            expect(activeTabs.at(0).text()).toBe('Content1');
        });
        it("shows first tab list entry as active", () => {
            const items = wrapper.findAll('li');
            const activeItems = items.filter(item => item.classes().includes('current'));
            expect(activeItems.length).toBe(1);
            expect(activeItems.at(0).text()).toBe('eins');
        });
    });
    describe("use propertie", () => {
        const options = {
            propsData: {
                type: 'sub'
            }
        };
        const wrapper = mount(TabPane, options);
        it("type", () => {
            const container = wrapper.findAll('div').at(1);
            expect(container.classes()).toContain('jqTabPaneFlat'+options.propsData.type);
        });
    });
    describe("tab updates", () => {
        it("when user clicks on tab", () => {
            const allItems = wrapper.findAll('li');
            const secondLink = wrapper.findAll('a').at(1);
            secondLink.trigger('click');
            const activeAfterClick = allItems.filter(item => item.classes().includes('current'));
            expect(activeAfterClick.length).toBe(1);
            expect(activeAfterClick.at(0).text()).toBe('zwei');
            const allTabs = wrapper.findAll('.vue-tab');
            const visibleTabs = allTabs.filter(tab => tab.isVisible());
            expect(visibleTabs.length).toBe(1);
            expect(visibleTabs.at(0).text()).toBe('Content2');
        });
    });
});

