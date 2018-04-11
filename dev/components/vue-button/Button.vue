<template>
  <button
    v-once
    :disabled="isDisabled"
    :class="[type, color]"
    class="button">
    <i
      v-if="icon"
      :class="icon"
      aria-hidden="true"/>
    {{ title }}
  </button>
</template>

<script>
export default {
  props: {
    'title':{
      type: String,
      default: ''
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
      type: [String, Array],
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
