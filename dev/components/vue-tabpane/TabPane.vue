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
                        :class="{active: isDropdownOpen}"
                        href="#"
                        style="display: inline-block;">
                        {{ $t('tabpane_more') }}
                        <i
                            :class="moreTabIconClass"
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
            :element="$refs['moreTab']"
            @show="onDropdownShow"
            @hide="onDropdownHide">
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
import Tab from "./TabPaneTab.vue";
import VueDropdown from "../vue-dropdown/VueDropdown.vue";

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
        isDropdownOpen: false,
    }),
    computed: {
        moreTabIconClass() {
            return {
                "fa-angle-down": !this.isDropdownOpen,
                "fa-angle-up": this.isDropdownOpen
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
            if(!this.$slots.default){
                return [];
            }
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
            let accumulatedTabsWidth = 0;
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
            this.isDropdownOpen = !this.isDropdownOpen;
            this.$refs['dropdown'].toggle();
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
        onDropdownShow() {
            this.isDropdownOpen = true;
        },
        onDropdownHide() {
            this.isDropdownOpen = false;
        }
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
      &.active {
        color: $ma-primary !important;
      }
      &:hover {
        color: $ma-primary !important;
      }
    }

    .show-more-dropdown {
      position: fixed;
    }
  }

  .hidden-tab {
    visibility: hidden;
  }
}

</style>
