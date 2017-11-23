<template>
    <div>
        <div v-show="isActive" class="sidebar_overlay" @click="hide" />
        <div class="flatskin-wrapped sidebar-container" :class="{active: isActive}" v-on:click.stop>

            <div class="tab-controls">
                <sidebar-tab-button icon="fa-times" type="close" @click="hide" />
                <div class="controls">
                    <template v-for="(tab,index) in tabs">
                        <sidebar-tab-button ref="sidebar-tab-buttons" :icon="tab.icon" :title="tab.tooltip" @click="selectTab(index)"/>
                    </template>
                </div>
            </div>

            <div class="tab-contents">
                <slot v-if="tabs.length == 0"></slot>
                <slot v-if="tabs.length > 0" :name="selectedTab">
                  {{tabs[selectedTab].tooltip}}
                </slot>
            </div>

            <transition name="fade">
            <!-- <sidebar-toast v-if="toast" :config="toast" /> -->
            </transition>

            <transition name="fade">
            <sidebar-modal v-if="modalConfig"
                           :config="modalConfig" />
            </transition>
        </div>
    </div>
</template>

<script>
import SidebarTabButton from './sidebar-tab-button';
import SidebarModal from './sidebar-modal';
// var initialize = function(config) {
//   config = Object.assign({}, config);
//   if (!Object.keys(config).length) {
//     throw 'Invalid configuration object!';
//   }

//   var tabs = [];
//   if (config.tabs && Array.isArray(config.tabs)) {
//     config.tabs.forEach(function(tab) {
//       if (!tab.icon) {
//         throw "Invalid tab configuration. Parameter 'icon' is mandatory!";
//       }

//       tabs.push({icon: tab.icon, tooltip: tab.tooltip, callback: tab.callback});
//     });
//   }

//   initializeMarginals.call(this, config);
//   this.tabs = tabs;
//   this.isInitalized = true;
// };

var hideSidebar = function() {
  this.isActive = false;
  // this.isActive = this.isHighlighted = false;
  // this.content = this.contentComponent = this.toast = undefined;

  // // reset 'this.header' and 'this.footer' if they were set by 'showContent'
  // if (!this.isInitalized) {
  //   this.footer = undefined;
  //   this.header = undefined;
  // }
}



var showSidebar = function() {
  this.isActive = true;
  // if (!this.isInitalized) {
  //   if (window.console && console.debug) {
  //     console.debug("You have to call 'sidebar.initialize' first!");
  //     return;
  //   }
  // }

  // var content = extractContent.call(this, config);
  // if (content === false) {
  //   throw "Invalid content element. Needs to be one of: jQuery element, DOM element or plain (HTML) string";
  // }

  // this.isHighlighted = !!config.highlight;
  // this.content = content;
  // this.contentComponent = config.contentComponent;

  // this.isActive = true;
  // resetActiveTab.call(this);
};

export default {
  name: 'qwiki-sidebar',
  components: {
    SidebarTabButton,
    SidebarModal
  },
  props: {
    tabs: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    show: showSidebar,
    hide: hideSidebar,
    selectTab(index){
      this.selectedTab = index;
    },
    showModal(config) {
      this.modalConfig = config;
    }
  },
  data: function() {
    return {
      isActive: false,
      selectedTab: 0,
      modalConfig: null,

    };
  },
  created: function() {
  }
}
</script>

<style lang="scss">
@import './sass/settings';

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s
}
.fade-enter,
.fade-leave-to {
  opacity: 0
}
.sidebar_overlay {
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    z-index: 99;
}
.sidebar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  width: $sidebar-width;
  z-index: $sidebar-z-index;

  transform: translate3d(100%, 0, 0);
  transition: transform .3s ease-in-out;

  &.active {
    transform: translate3d(0, 0, 0);
  }

  *:focus {
    outline:none;
  }
}

.tab-controls {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;

  background-color: $gray;
  border-left: $sidebar-highlight-border-width solid $gray;
  width: calc(#{$sidebar-width} - #{$sidebar-content-width});

  &.highlight {
    border-left-color: $sidebar-highlight-border-color;
  }
}

.tab-contents {
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(#{$sidebar-width} - #{$sidebar-content-width});
  background-color: $white;
  width: $sidebar-content-width;

  > .content {
    padding: $sidebar-content-padding;
    height: calc(100% - 60px);
    overflow-y: auto;
    white-space: -moz-pre-wrap !important;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    white-space: pre-wrap;
    white-space: -webkit-pre-wrap;
    white-space: normal;

    .section-title {
      display: block;
      margin: $sidebar-content-padding-horizontal #{-$sidebar-content-padding-horizontal} $sidebar-content-padding-vertical;
      padding: 0 $sidebar-content-padding-horizontal;
      border-bottom: 2px solid $light-gray;

      color: $primary-color;
      font-size: 1.25rem;

      .sub {
        color: $black;
        font-size: .75rem;
      }

      &:first-child {
        margin-top: 0;
      }
    }
  }
}
</style>
