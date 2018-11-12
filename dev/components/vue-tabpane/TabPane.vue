<template>
    <div class="flatskin-wrapped vue-tabpane">
        <div :class="'jqTabPaneFlat'+type">
            <ul
                ref="pane"
                class="vue-tabpane-group">
                <Tab
                    v-for="tab in tabsToShow"
                    ref="shownTab"
                    :key="tab.id"
                    :id="tab.id"
                    :has-sub="tab.hasSub || false"
                    :name="tab.name"
                    :is-current="tab.current || false"
                    :original-index="tab.originalIndex"
                    class="visible-tab"
                    @select="selectTab"/>
                <li
                    v-visible="tabsToHide.length > 0"
                    ref="moreTab"
                    class="more-tab"
                    @click="toggleMoreDropdown">
                    <a
                        href="#"
                        style="display: inline-block;">
                        {{ $t('tabpane_more') }}
                        <i
                            :class="splitButtonIconClass"
                            class="dropdown-icon far"
                            aria-hidden="true"/>
                    </a>
                </li>
                <Tab
                    v-for="(tab, index) in tabsToHide"
                    ref="hiddenTab"
                    :key="index"
                    :id="tab.id"
                    :has-sub="tab.hasSub"
                    :name="tab.name"
                    :is-current="tab.current || false"
                    :original-index="tab.originalIndex"
                    class="hidden-tab" />
            </ul>
            <span class="clearfix"/>
            <slot/>
        </div>
        <vue-dropdown
            v-if="tabsToHide.length > 0"
            ref="dropdown"
            :element="$refs['moreTab']">
            <li
                v-for="tab in tabsToHide"
                :key="tab.id"
                class="hidden-tab-entry"
                @click.prevent="selectTabFromMore(tab.id)">
                <a
                    v-html="tab.name" />
            </li>
        </vue-dropdown>
    </div>
</template>

<script>
import ResizeSensor from "css-element-queries/src/ResizeSensor";
import Tab from "./InternalTab.vue";
import VueDropdown from "../vue-dropdown/VueDropdown.vue";

const FITTING_MARGIN = 0;

export default {
    name: "VueTabpane",
    i18nextNamespace: "VueJSPlugin",
    components: {
        Tab,
        VueDropdown,
    },
    props: {
        type: {
            type: String,
            default: ""
        }
    },
    data: () => ({
        tabs: [],
        tabsToShow: [],
        tabsToHide: [],
        showMoreDropdown: false,
        moreDropdownStyle: { top: 0, left: 0 }
    }),
    computed: {
        splitButtonIconClass() {
            return {
                "fa-angle-down": !this.showMoreDropdown,
                "fa-angle-up": this.showMoreDropdown
            };
        }
    },
    mounted() {
            this.tabs = this.getTabComponentsFromDefaultSlot();
            if(this.tabs[0]){
                this.selectTab(this.tabs[0].id);
            }
        new ResizeSensor(this.$refs["pane"], () => {
            this.recalculateTabsToShow();
        });

        this.tabsToShow = this.tabs;

        Vue.nextTick(this.recalculateTabsToShow);
    },
    methods: {
        getTabComponentsFromDefaultSlot() {
            return this.$slots.default
                .filter(vnode => {
                    return !!vnode.componentInstance;
                })
                .map((vnode, index) => {
                    vnode.componentInstance.originalIndex = index;
                    return vnode.componentInstance;
                });
        },
        getTabWidths() {
            const activeTabIndex = this.getActiveTabIndex();
            const shownTabs = this.$refs["shownTab"] || [];
            const hiddenTabs = this.$refs["hiddenTab"] || [];
            return []
                .concat(shownTabs)
                .concat(hiddenTabs)
                .sort((a, b) => {
                    return a.originalIndex - b.originalIndex;
                })
                .map(tabComponent => {
                    return this.getWidthWithMargins(tabComponent.$el);
                });
        },
        selectTab(selectedTabId) {
            this.$children.forEach(tab => {
                tab.current = tab.id === selectedTabId;
            });
        },
        getPaneWidth() {
            return this.$refs["pane"].clientWidth;
        },
        getMoreTabWidth() {
            return this.getWidthWithMargins(this.$refs["moreTab"]);
        },
        allTabsFitIntoPane() {
            const paneWidth = this.getPaneWidth();
            const tabWidths = this.getTabWidths();
            let accumulatedTabsWidth = FITTING_MARGIN;
            for (let i = 0; i < tabWidths.length; i++) {
                accumulatedTabsWidth += tabWidths[i];
                if (accumulatedTabsWidth > paneWidth) {
                    return false;
                }
            }
            return true;
        },
        showFittingTabsWithMoreTab() {
            const paneWidth = this.getPaneWidth();
            const tabWidths = this.getTabWidths();
            const activeTabIndex = this.getActiveTabIndex();

            let accumulatedTabsWidth =
                FITTING_MARGIN +
                this.getMoreTabWidth() +
                + tabWidths[activeTabIndex];

            for (let i = 0; i < tabWidths.length; i++) {
                if(i === activeTabIndex) {
                    continue;
                }
                accumulatedTabsWidth += tabWidths[i];
                if (accumulatedTabsWidth > paneWidth) {
                    this.tabsToHide.push(this.tabs[i]);
                } else {
                    this.tabsToShow.push(this.tabs[i]);
                }
            }
            this.tabsToShow.splice(activeTabIndex, 0, this.tabs[activeTabIndex]);

        },
        recalculateTabsToShow() {
            this.tabsToShow = [];
            this.tabsToHide = [];
            if(this.allTabsFitIntoPane()){
                this.tabsToShow = this.tabs;
            } else {
                this.showFittingTabsWithMoreTab();
            }
        },
        getActiveTabIndex() {
            return this.tabs.findIndex((tab) => {
                return tab.current;
            });
        },
        toggleMoreDropdown() {
            this.$refs['dropdown'].toggle();
        },
        onClickOutside() {
            this.toggleMoreDropdown();
        },
        recalculateMoreDropdownPosition() {
            const moreTabElement = this.$refs.moreTab;

            const boundingRect = moreTabElement.getBoundingClientRect();

            const buttonHeight = moreTabElement.offsetHeight;

            const buttonTop = boundingRect.top;
            const buttonLeft = boundingRect.left;

            const dropdownTop = `${buttonTop + buttonHeight}px`;
            const dropdownLeft = `${buttonLeft}px`;

            this.moreDropdownStyle = {
                top: dropdownTop,
                left: dropdownLeft
            };
        },
        selectTabFromMore(selectedTabId) {
            this.selectTab(selectedTabId);
            this.toggleMoreDropdown();
            this.recalculateTabsToShow();
        },
        getWidthWithMargins(element) {
            const style = window.getComputedStyle(element);
            const width = parseFloat(style.width);
            const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);

            return width + margin;
        },
    }
};
</script>

<style lang="scss">
@import "../../sass/settings";
.flatskin-wrapped .jqTabPaneFlat > .vue-tabpane-group li.current a.hasSubMenu {
  background: #eff3f4;
  border-bottom: 2px solid #eff3f4;
}
ul.vue-tabpane-group,
#modacWrapper ul.vue-tabpane-group {
  padding-left: 0;
  list-style: none;
  display: block;
  float: left;
  overflow: visible !important;
  border-bottom: 2px solid $light-gray;
  width: 100%;

  li {
    float: left;
    list-style: none;
  }

  a:hover,
  a {
    text-decoration: none;
    white-space: nowrap;
    float: left;
    display: block;
    text-shadow: 0 1px #fff;
  }
  a:focus {
    outline: none;
  }

  .more-tab {
    a {
      color: $ma-tertiary-text !important;
      &:hover {
        color: $ma-primary !important;
      }
    }

    .show-more-dropdown {
      position: fixed;
    }
  }
}

.shadow-pane {
  position: absolute;
  top: 100px;
  opacity: 0.4;
  visibility: hidden;
}

.hidden-tab {
  visibility: hidden;
}
</style>
