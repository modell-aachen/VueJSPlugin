<template>
  <div
    class="ma-input-group"
    :class="{'ma-failure': hasError}">
    <label if="label">{{ label }}</label>
    <input
      :name="name"
      v-model="data"
      v-validate="validate"
      :class="{'ma-small': isSmall}"
      type="text"
      :placeholder="placeholder"
      :disabled="isDisabled">
    <template v-if="hasError">
      <i
        class="fas fa-exclamation-circle"
        aria-hidden="true"/>
      <small>{{ definedErrorMessage }}</small>
    </template>
    <template v-else-if="icon">
      <i
        v-if="icon"
        :class="icon"
        aria-hidden="true"/>
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
    'name': {
      type: String,
      default: ''
    },
    'validate': {
      type: String,
      default: ''
    },
    'errorMessage': {
      type: String,
      default: ''
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
    },
    hasError: function(){
      return this.validationErrors.has(this.name);
    },
    definedErrorMessage: function() {
      return this.errorMessage || this.validationErrors.first(this.name);
    }
  }
};
</script>

<style lang="scss">
</style>
