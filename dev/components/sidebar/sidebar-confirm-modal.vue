<template>
<div>
  <h3>{{this.config.header}}</h3>
  <div>
    <p v-for="descriptionText in description">{{descriptionText}}</p>
  </div>
  <div class="small button-group float-right">
    <button class="default button" @click="onButtonClick(config.abortButton)">{{config.abortButton.name}}</button>
    <button class="primary button" @click="onButtonClick(config.acceptButton)">{{config.acceptButton.name}}</button>
  </div>
  <div class="background-icon">
    <i class="fa" :class="config.backgroundIcon"></i>
  </div>
</div>
</template>

<script>
export default {
  props: ['config'],
  computed: {
    description() {
      if(typeof this.config.description === "string"){
        return [this.config.description];
      }
      return this.config.description;
    }
  },
  methods: {
    onButtonClick(buttonConfig) {
      buttonConfig.onClick();
      this.$emit('hide-modal');
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
    height: 100%;
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
  .background-icon {
    position: absolute;
    font-size: 20em;
    color: $secondary-color;
    bottom: 20%;
    left: 50%;
    transform: translate(-50%);
    z-index: -1;
  }
}
</style>
