import TabPane from '../dev/components/vue-tabpane/TabPane.vue';
import TabPaneContainer from './TabPaneContainer.vue';
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
        xit("displays Tabs", () => {
            const allTabs = this.wrapper.findAll('.vue-tab');
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
    describe("hides tabs dynamically depending on its size:", () => {
        const getActiveTabName = () => {
            return tabPaneWrapper.find(".current a").text();
        };

        const clickOnTabInMoreOptions = async (index) => {
            tabPaneWrapper.find(".more-tab").trigger('click');
            await Vue.nextTick();

            await tabPaneWrapper.findAll(".hidden-tab-entry")
            .wrappers[index].trigger('click');
        };

        const isMoreTabVisible = () => {
            return tabPaneWrapper.find({ref: "moreTab"}).isVisible();
        }

        const getVisibleTabNames = () => {
            return tabPaneWrapper
                .findAll(".visible-tab a")
                .wrappers
                .map((wrapper) => {
                    return wrapper.text();
                });
        };

        let tabPaneWrapper;
        let tabWidths = [100, 100, 100];
        beforeEach(() => {
            tabPaneWrapper = TestCase.mount(TabPane, {
                methods: {
                    getPaneWidth: () => {
                        return 500;
                    },
                    getMoreTabWidth: () => {
                        return 100;
                    },
                    getTabWidths: () => {
                        return tabWidths;
                    },
                },
                slots:  {
                    default: `<vue-tab name="eins">Content1</vue-tab>
                      <vue-tab name="zwei">Content2</vue-tab>
                      <vue-tab name="drei">Content3</vue-tab>`,
                },
            });
        });

        afterEach(() => {
            tabPaneWrapper.destroy();
        });

        it("All tabs are shown if they all fit into the pane", TestCase.wrapAsync(async () => {
            await Vue.nextTick();
            expect(getVisibleTabNames()).toEqual(['eins', 'zwei', 'drei']);
        }));

        it("The more tab is not shown if all tabs fit into the page", TestCase.wrapAsync(async () => {
            await Vue.nextTick();
            expect(isMoreTabVisible()).toBe(false);
        }));

        it("The more tab becomes visible if tabs need to be hidden", TestCase.wrapAsync(async () => {
            tabWidths = [100, 400, 100];
            tabPaneWrapper.vm.recalculateTabsToShow();
            await Vue.nextTick();
            expect(isMoreTabVisible()).toBe(true);
        }));

        it("The more tab hides the last tab if the last tab does not fit", async () => {
            tabWidths = [100, 100, 400];
            tabPaneWrapper.vm.recalculateTabsToShow();
            await Vue.nextTick();

            expect(getVisibleTabNames()).toEqual(['eins', 'zwei']);
        });

        it("The more tab hides the last two elements if they do not fit", async () => {
            tabWidths = [100, 500, 400];
            tabPaneWrapper.vm.recalculateTabsToShow();
            await Vue.nextTick();

            expect(getVisibleTabNames()).toEqual(['eins']);
        });

        it("The more tab hides the last two tabs if the last tab does not fit but the more tab is wider than the last tab", async () => {
            tabWidths = [300, 150, 80];
            tabPaneWrapper.vm.recalculateTabsToShow();
            await Vue.nextTick();

            expect(getVisibleTabNames()).toEqual(['eins']);
        });

        it("A hidden tab thats activated becomes visible", async () => {
            tabWidths = [200, 200, 200];
            tabPaneWrapper.vm.recalculateTabsToShow();
            await Vue.nextTick();
            await clickOnTabInMoreOptions(0);

            expect(getVisibleTabNames()).toEqual(['eins', 'drei']);
        });

        it("A hidden tab thats activated becomes visible", async () => {
            tabWidths = [200, 200, 200];
            tabPaneWrapper.vm.recalculateTabsToShow();
            await Vue.nextTick();
            await clickOnTabInMoreOptions(0);

            expect(getVisibleTabNames()).toEqual(['eins', 'drei']);
        });
    });
});

