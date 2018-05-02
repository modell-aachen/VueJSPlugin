<template>
  <a
    :disabled="isDisabled"
    :href="href"
    :class="[type, color, title ? 'has-text' : 'no-text']"
    class="button vue-button"
    @click="handleClick">
    <div
      v-if="icon"
      class="icon-wrapper"
    >
      <i
        :class="icon"
        class="button-icon"
        aria-hidden="true"/>
    </div>
    <span
      v-if="title && title.length"
      class="button-text"
    >
      <span
        v-if="icon"
        class="icon-spacer"
      />
      {{ title }}
    </span>
  </a>
</template>

<script>
export default {
  props: {
    'title':{
      type: String,
      default: ''
    },
    'href': {
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
  },
  methods: {
    handleClick: function( event ) {
      if( this.isDisabled || this.href.length <= 0 ) {
        event.preventDefault();
      }
    }
  }
};
</script>

<style lang="scss">
</style>
