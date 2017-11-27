<template>
<div class="sidebar-modal">
  <div class="sidebar-tab-controls">
    <button class="sidebar-tab-button close" @click="hideModal">
      <i class="fa fa-2x fa-times"></i>
    </button>
  </div>
  <div class="modal-content">
    <component :is="type" :config="contentConfig" @hide-modal="hideModal"></component>
  </div>
</div>
</template>

<script>
import ConfirmModal from './ConfirmModal';
export default {
  name: 'sidebar-modal',
  props: ['type', 'contentConfig'],
  components: {
    ConfirmModal
  },
  methods: {
    hideModal() {
      this.$emit("hide-modal");
    }
  }
};
</script>

<style lang="scss">
@import './sass/settings';

.sidebar-modal {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background: rgba($white, $sidebar-modal-opacity);
  z-index: 2 + $sidebar-z-index;

  .modal-content {
    @include sidebar-content;
    top: $sidebar-header-height;
    z-index: 3 + $sidebar-z-index;
    padding: $sidebar-content-padding;
    background: rgba($white, 0);

    * {
      white-space: -moz-pre-wrap !important;
      white-space: -pre-wrap;
      white-space: -o-pre-wrap;
      white-space: pre-wrap;
      white-space: -webkit-pre-wrap;
      white-space: normal;
    }
  }
}
</style>
