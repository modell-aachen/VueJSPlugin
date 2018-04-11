<template>
  <div>
    <h3 class="ma-primary-color">{{ config.header }}</h3>
    <div>
      <p
        v-for="descriptionText in description"
        :key="descriptionText.descriptionText">{{ descriptionText }}</p>
    </div>
    <div class="small button-group float-right">
      <button
        class="default button"
        @click.prevent="onButtonClick(config.abortButton)">{{ config.abortButton.name }}</button>
      <button
        class="primary button"
        @click.prevent="onButtonClick(config.acceptButton)">{{ config.acceptButton.name }}</button>
    </div>
    <div class="modal-background-icon">
      <i
        :class="config.backgroundIcon"
        class="fa"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      required: true
    }
  },
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
};
</script>

<style lang="scss">
@import './sass/settings';

.sidebar-modal {
  .modal-background-icon {
    position: absolute;
    font-size: 20em;
    color: $sidebar-modal-icon-color;
    bottom: 20%;
    left: 50%;
    transform: translate(-50%);
    z-index: -1;
  }
}
</style>
