<template>
  <div>
    <div
      v-show="isActive"
      class="sidebar-overlay"
      @click="hide"/>
    <transition name="sidebar">
      <div
        v-show="isActive"
        class="flatskin-wrapped sidebar-container"
        :class="{active: isActive}"
        @click.stop>

        <div class="sidebar-tab-controls">
          <tab-button
            icon="fa-times"
            type="close"
            @click="hide" />
          <div class="controls">
            <template v-for="(tab,index) in tabs">
              <tab-button
                ref="sidebar-tab-buttons"
                :icon="tab.icon"
                :title="tab.tooltip"
                :is-active="selectedTab === index"
                @click="selectTab(index)"/>
            </template>
          </div>
        </div>

        <div class="sidebar-tab-contents">
          <slot v-if="tabs.length == 0"/>
          <slot
            v-if="tabs.length > 0"
            :name="'tab' + selectedTab">
            {{ tabs[selectedTab].tooltip }}
          </slot>
        </div>

        <transition name="fade">
          <modal
            v-if="isModalActive"
            :type="modalOptions.type"
            :content-config="modalOptions.contentConfig"
            @hide-modal="hideModal"/>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import TabButton from './TabButton';
import Modal from './Modal';

export default {
  components: {
    TabButton,
    Modal,
  },
  props: {
    tabs: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data: function() {
    return {
      isActive: false,
      selectedTab: 0,
      modalOptions: null,
    };
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
        this.modalOptions.type = "confirm-modal";
      }
    },
    hideModal() {
      this.modalOptions = null;
    }
  },
};
</script>

<style lang="scss">
@import './sass/settings';
@import '../../sass/settings';

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s
}
.fade-enter,
.fade-leave-to {
  opacity: 0
}
.sidebar-overlay {
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    z-index: 99;
}

.sidebar-enter, .sidebar-leave-to {
  transform: translate3d(100%,0,0);
}
.sidebar-enter-active, .sidebar-leave-active {
  transition: transform .3s ease-in-out;
}

.sidebar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  width: $sidebar-width;
  z-index: $sidebar-z-index;

  *:focus {
    outline:none;
  }
}

.sidebar-tab-controls {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;

  background-color: $ma-medium-grey;
  border-left: $sidebar-highlight-border-width solid $ma-medium-grey;
  width: calc(#{$sidebar-width} - #{$sidebar-content-width});

  &.highlight {
    border-left-color: $sidebar-highlight-border-color;
  }
}

.sidebar-tab-contents {
  @include sidebar-content;
  hr {
    margin: 12px -#{$sidebar-content-padding-horizontal};
    height: 2px;
    background-color: $ma-medium-grey;
  }
}
</style>
