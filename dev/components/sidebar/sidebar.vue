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
            <sidebar-modal v-if="isModalActive" :type="modalOptions.type" :contentConfig="modalOptions.contentConfig" @hide-modal="hideModal"/>
            </transition>
        </div>
    </div>
</template>

<script>
import SidebarTabButton from './sidebar-tab-button';
import SidebarModal from './sidebar-modal';

export default {
  components: {
    SidebarTabButton,
    SidebarModal,
  },
  props: {
    tabs: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    isModalActive: {
      get(){
        return !!this.modalOptions;
      }
    }
  },
  methods: {
    show(){
      this.isActive = true;
    },
    hide(){
      this.isActive = false;
    },
    selectTab(index){
      this.selectedTab = index;
    },
    showModal(modalOptions) {
      this.modalOptions = modalOptions;
      if(!this.modalOptions.type){
        this.modalOptions.type = "sidebar-confirm-modal";
      }
    },
    hideModal() {
      this.modalOptions = null;
    }
  },
  data: function() {
    return {
      isActive: false,
      selectedTab: 0,
      modalOptions: null,
    };
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
