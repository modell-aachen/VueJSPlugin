<template>
<div>
  <h3 class="ma-primaryColor">{{this.config.header}}</h3>
  <div>
    <p v-for="descriptionText in description">{{descriptionText}}</p>
  </div>
  <div class="small button-group float-right">
    <button class="default button" @click="onButtonClick(config.abortButton)">{{config.abortButton.name}}</button>
    <button class="primary button" @click="onButtonClick(config.acceptButton)">{{config.acceptButton.name}}</button>
  </div>
  <div class="modal-background-icon">
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
