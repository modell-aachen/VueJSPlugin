import TabPane from '../dev/components/vue-tabpane/TabPane.vue';
import TestCase from '../dev/unit-test-library/main';

let mount = TestCase.mount;
describe("The TabPane component", () => {
  beforeEach(() => {
    // Pops default for id in vue-tab is undefined, so we need to define id.
    const options = {
      slots:  {
        default: `<vue-tab name="eins">Content1</vue-tab>
                  <vue-tab name="zwei">Content2</vue-tab>
                  <vue-tab name="drei">Content3</vue-tab>`,
      }
    };
    this.wrapper = mount(TabPane, options);
    this.wrapper.update();
  });
  describe("with default values", () => {
    it("renders a TabPane", () => {
      expect(this.wrapper.contains('div')).toBe(true);
      expect(this.wrapper.classes()).toContain('vue-tabpane');
    });
    it("displays Tabs", () => {
      const allTabs = this.wrapper.findAll('.vue-tab');
      expect(allTabs.length).toBe(3);
      const allTabTitles = this.wrapper.findAll('li');
      expect(allTabTitles.length).toBe(3);
    });
    it("shows first tab", () => {
      const allTabs = this.wrapper.findAll('.vue-tab');
      const activeTabs = allTabs.filter(tab => tab.isVisible());
      expect(activeTabs.length).toBe(1);
      expect(activeTabs.at(0).text()).toBe('Content1');
    });
    it("shows first tab list entry as active", () => {
      const items = this.wrapper.findAll('li');
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
      const allItems = this.wrapper.findAll('li');
      const secondLink = this.wrapper.findAll('a').at(1);
      secondLink.trigger('click');
      this.wrapper.update();
      const activeAfterClick = allItems.filter(item => item.classes().includes('current'));
      expect(activeAfterClick.length).toBe(1);
      expect(activeAfterClick.at(0).text()).toBe('zwei');
      const allTabs = this.wrapper.findAll('.vue-tab');
      const visibleTabs = allTabs.filter(tab => tab.isVisible());
      expect(visibleTabs.length).toBe(1);
      expect(visibleTabs.at(0).text()).toBe('Content2');
    });
  });
});

