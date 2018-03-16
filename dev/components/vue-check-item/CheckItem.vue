<template>
  <div class="ma-switch">
    <input
      :id="id"
      :name="name"
      :value="value"
      :disabled="disabled"
      :checked="state"
      :type="type"
      :class="{'switch-input': isSwitch}"
      @change="onChange">
    <label
      :class="{'switch-paddle': isSwitch}"
      :for="id || value">
      <slot v-if="!isSwitch"/>
    </label><slot v-if="isSwitch"/><br>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'modelValue',
    event: 'input'
  },
  props: {
    id: {
      type: String,
      default: function () {
        return 'checkbox-id-' + this._uid;
      },
    },
    name: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
    modelValue: {
      type: [Array, Object],
      default: undefined,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isSwitch: {
      type: Boolean,
      default: false,
    },
    type:{
      type: String,
      default: 'checkbox'
    },
    model: {
      type: [Object, Array],
      default: undefined
    }
  },
  computed: {
    state: function() {
      if (this.modelValue === undefined) {
        return this.checked;
      }
      if (Array.isArray(this.modelValue)) {
        return this.modelValue.indexOf(this.value) > -1;
      }
      if(this.type === 'radio') {
        return this.modelValue === this.value;
      } else {
        return !!this.modelValue;
      }
    }
  },
  watch: {
    checked(newValue) {
      if (newValue !== this.state) {
        this.toggle();
      }
    }
  },
  mounted() {
    if (this.checked && !this.state) {
      this.toggle();
    }
  },
  methods: {
    onChange() {
      this.toggle();
    },
    toggle() {
      let value;
      if (Array.isArray(this.modelValue)) {
        value = this.modelValue.slice(0);
        if (this.state) {
          value.splice(value.indexOf(this.value), 1);
        } else {
          value.push(this.value);
        }
      } else {
        if(this.type === 'radio'){
          value = this.state ? '': this.value;
        } else {
          value = !this.state;
        }
      }
      this.$emit('input', value);
    }
  },
};
</script>

<style lang="scss">
</style>
