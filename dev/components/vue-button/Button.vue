<template>
  <button class="button" :class="[type, color]" v-bind:disabled="isDisabled">
    <i v-if="icon" :class="icon" aria-hidden="true"></i>
    {{ title }}
  </button>
</template>

<script>
export default {
  props: {
    'title':{
      type: String,
    },
    'type':{
      type: String,
      default: '',
      validator: function(value) {
        let types = [
          '',
          'primary',
          'ghost',
          'delete',
          'icon'];
        return types.includes(value);
      }
    },
    'color': {
      type: String,
      default: '',
      validator: function(value) {
        let colors = [
          '',
          'ma-warning-color'
        ];
        return colors.includes(value);
      }
    },
    'icon':{
      type: String,
      default: undefined
    },
    'isDisabled':{
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss">
</style>
