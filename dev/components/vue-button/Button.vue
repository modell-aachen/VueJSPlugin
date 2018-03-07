<template>
  <a class="button" :class="type" v-bind:disabled="isDisabled"><i v-if="icon" :class="icon"></i>{{ title }}</a>
</template>

<script>
export default {
  props: {
    'title':{
      type: String,
    },
    'type':{
      type: String,
      default: ''
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

