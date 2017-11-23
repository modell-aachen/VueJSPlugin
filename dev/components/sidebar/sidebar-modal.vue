<template>
<div class="sidebar-modal">
  <div class="modal-icon" v-if="classes"><i class="fa" :class="classes"></i></div>
  <div class="modal-content">
    <div>Modal!</div>
<!--     <component :is="config.type"></component> -->
  </div>
</div>
</template>

<script>
export default {
  name: 'sidebar-modal',
  props: ['config'],
  computed: {
    classes: function() {
      if (!this.config.icon && !this.config.type) {
        return undefined;
      }

      var cls = {};
      if (this.config.color) {
        cls[color] = true;
      }

      if (this.config.type) {
        if (this.config.type === 'spinner') {
          cls['fa-refresh'] = true;
          cls['fa-spin'] = true;
        } else if (this.config.type === 'success') {
          cls['fa-check'] = true;
          cls['success'] = true;
        } else if (this.config.type === 'warning') {
          cls['fa-exclamation-triangle'] = true;
          cls['warning'] = true;
        } else if (this.config.type === 'error') {
          cls['fa-times'] = true;
          cls['alert'] = true;
        }
      } else {
        cls[this.config.icon] = true;
      }

      return cls;
    }
  },
  methods: {
    confirm: function() {
      var cancel = undefined;
      if (typeof this.config.buttons.confirm.callback === 'function') {
        cancel = this.config.buttons.confirm.callback.call(this);
      }

      if (cancel !== false) {
        this.$emit('modal-confirmed');
      }
    },
    cancel: function() {
      var cancel = undefined;
      if (typeof this.config.buttons.cancel.callback === 'function') {
        cancel = this.config.buttons.cancel.callback.call(this);
      }

      if (cancel !== false) {
        this.$emit('modal-canceled');
      }
    }
  }
}
</script>

<style lang="scss">
@import './sass/settings';

.sidebar-modal {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background: $white;
  background: rgba($white, $sidebar-modal-opacity);
  z-index: 2 + $sidebar-z-index;

  .modal-icon {
    position: absolute;
    top: calc(50% - 4rem);
    left: calc(50% - 4rem + #{$sidebar-width} - #{$sidebar-content-width});
    z-index: 3 + $sidebar-z-index;
    color: $sidebar-modal-icon-color;

    i {
      font-size: 8rem;

      &.success {
        color: $success-color;
      }

      &.warning {
        color: $warning-color;
      }

      &.alert {
        color: $alert-color;
      }

      &.primary {
        color: $primary-color;
      }

      &.secondary {
        color: $secondary-color;
      }
    }
  }

  .modal-content {
    position: absolute;
    top: $sidebar-header-height;
    left: calc(#{$sidebar-width} - #{$sidebar-content-width});
    z-index: 3 + $sidebar-z-index;
    padding: $sidebar-content-padding;

    h3 {
      color: $primary-color;
      line-height: 100%;
      margin-top: 0;
      margin-bottom: 1rem;
    }

    * {
      white-space: -moz-pre-wrap !important;
      white-space: -pre-wrap;
      white-space: -o-pre-wrap;
      white-space: pre-wrap;
      white-space: -webkit-pre-wrap;
      white-space: normal;
    }
  }

  .modal-buttons {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    flex-wrap: nowrap;
    margin-top: 1rem;

    > :first-child {
      margin-left: .5rem;
    }
  }
}
</style>
