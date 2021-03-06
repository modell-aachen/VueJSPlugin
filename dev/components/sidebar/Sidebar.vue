<template>
    <div class="vue-sidebar">
        <div
            v-if="isActive"
            class="sidebar-overlay"
            @click="!uncancelable && hide({allowConfirmation: true})" />
        <transition name="sidebar">
            <div
                v-if="isActive"
                :class="{active: isActive}"
                class="flatskin-wrapped sidebar-container"
                @click.stop>
                <div class="sidebar-tab-controls">
                    <tab-button
                        v-if="!uncancelable"
                        icon="fa-times"
                        type="close"
                        @click="hide({allowConfirmation: true})" />
                    <div class="controls">
                        <template v-for="(tab,index) in tabs">
                            <tab-button
                                ref="sidebar-tab-buttons"
                                :key="tab.index"
                                :icon="tab.icon"
                                :title="tab.tooltip"
                                :is-active="selectedTab === index"
                                @click="selectTab(index)" />
                        </template>
                    </div>
                </div>

                <div class="sidebar-tab-contents">
                    <slot v-if="tabs.length == 0" />
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
                        @hide-modal="hideModal" />
                </transition>
            </div>
        </transition>
    </div>
</template>

<script>
import TabButton from './TabButton';
import Modal from './Modal';

export default {
    i18nextNamespace: 'VueJSPlugin',
    inject: ['$validator'],
    components: {
        TabButton,
        Modal,
    },
    props: {
        tabs: {
            type: Array,
            default() {
                return [];
            },
        },
        uncancelable: {
            type: Boolean,
            default: false,
        },
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
            },
        },
    },
    methods: {
        show(){
            this.isActive = true;
        },
        hide(options){
            let allowConfirmation = false;
            if(options) {
                allowConfirmation = options.allowConfirmation;
            }
            let confirmMessage;
            const callbacks = {};
            if(allowConfirmation) {
                callbacks.showConfirmDialog = message => {
                    confirmMessage = message || this.$t('sidebar_default_close_message');
                };
            }
            this.$emit('before-hide', callbacks);

            if(confirmMessage) {
                this.$showAlert({
                    type: "warning",
                    title: this.$t('sidebar_close_title'),
                    text: confirmMessage,
                    confirmButtonText: this.$t('sidebar_close_confirm'),
                    cancelButtonText: this.$t('common_cancel'),
                }).then(() => {
                    this.doHide();
                }).catch(() => {
                    // noop
                });
            } else {
                this.doHide();
            }
        },
        doHide() {
            this.isActive = false;
            this.$emit('hide');
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
        },
    },
};
</script>

<style lang="scss">
@import './sass/settings';
@import '../../sass/settings';

.vue-sidebar {
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
    transform: translateX(100%);
  }
  .sidebar-enter-active, .sidebar-leave-active {
    transition: transform .3s ease-in-out;
  }

  .sidebar-container {
    animation-fill-mode: forwards;
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
      &.small {
        margin: 24px 66% 24px 0px;
      }
    }
  }
}
</style>
