<template>
  <div class="ma-input-group">
    <label if="label">{{label}}</label>
    <input v-model="data" :class="{'ma-small': isSmall}" type="text" :placeholder="placeholder" v-bind:disabled="isDisabled">
    <template v-if="hasValidationError">
      <i v-if="icon" :class="icon" aria-hidden="true"></i>
      <small>{{error-notification}}</small>
    </template>
    <template v-else-if="icon">
      <i v-if="icon" :class="icon" aria-hidden="true"></i>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    'label':{
      type: String,
      default: undefined
    },
    'placeholder':{
      type: String,
      default: undefined
    },
    'icon':{
      type: String,
      default: undefined
    },
    'isSmall':{
      type: Boolean,
      default: false
    },
    'isDisabled':{
      type: Boolean,
      default: false
    },
    'value':{
      type: String,
      default: ''
    }
  },
  computed: {
    data: {
      get: function() {
        return this.value;
      },
      set: function(newValue) {
        this.$emit('typed', {value: newValue});
      }
    }
  },
  data: function() {
    return {
      hasValidationError: false
    };
  }
};
</script>

<style lang="scss">
</style>
