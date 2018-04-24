<template>
  <div class="ma-input" :class="{'ma-failure': hasError, 'has-label': (label!=undefined)}">
    <label v-if="label">{{ label }}</label>
    <div class="ma-input--wrapper">
      <i
        v-if="icon"
        :class="icon"
        class="ma-input-text-icon"
        aria-hidden="true"/>

      <input
        v-validate="validate"
        :name="name"
        v-model="data"
        :placeholder="placeholder"
        :class="{'ma-small': isSmall, 'ma-input-text-indent': (icon!=undefined)}"
        :disabled="isDisabled"
        type="text">

      <template v-if="hasError">
        <i
          class="fas fa-exclamation-circle"
          aria-hidden="true"/>
        <small>{{ definedErrorMessage }}</small>
      </template>

    </div>
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
      default: '',
      required: true
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
      type: [String, Array],
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
  inject: ['$validator'],
  computed: {
    data: {
      get: function() {
        return this.value;
      },
      set: function(newValue) {
        this.$emit('input', newValue);
      }
    },
    hasError: function(){
      return this.validationErrors.has(this.name);
    },
    definedErrorMessage: function() {
      return this.errorMessage || this.validationErrors.first(this.name);
    }
  },
  watch: {
    data: function(value){
      if(this.name) {
        this.$validator.validate(this.name, value);
      }
    }
  }
};
</script>

<style lang="scss">
.ma-input {
  margin: 0 0 1rem;
}
.ma-input--wrapper {
  position: relative;
}
.ma-input-text-icon {
  position: absolute;
  top: 12px;
  left: 12px;
}
.ma-input-text-indent {
  text-indent: 30px;
}

</style>
