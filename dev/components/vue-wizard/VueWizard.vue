<template>
  <div class="vue-wizard grid-x">

    <div class="cell shrink icon">
      <i
        :class="iconClass"
      />
    </div>

    <div class="cell auto grid-y">
      <h2 class="cell ma-primary-color">{{ heading }}</h2>
      <div class="cell">
        <div v-if="text">{{ text }}</div>
        <vue-button
          v-if="( buttonCallback || buttonHref) && buttonText"
          :title="buttonText"
          :href="buttonHref"
          type="primary"
          @click.native="buttonCallback"
        />
      </div>
    </div>
  </div>
</template>

<script>
const normalizeIconClass = iconClass => {
  if(!/(?:^|\s)fa\w?(?:$|\s)/.test(iconClass)) {
    iconClass = `far ${iconClass}`;
  }
  if(!/(?:^|\s)fa-\d+x(?:$|\s)/.test(iconClass)) {
    iconClass = `${iconClass} fa-2x`;
  }
  return iconClass;
};
const defaultIcon = normalizeIconClass("fa-magic");

export default {
  props: {
    params: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      iconClass: defaultIcon,
      text: "",
      heading: "",
      buttonHref: "",
      buttonText: "",
      buttonCallback: ""
    };
  },
  watch: {
    params: function() {
      this.iconClass = defaultIcon;
      this.text = "";
      this.heading = "";
      this.buttonHref = "";
      this.buttonText = "";
      this.buttonCallback = "";
      this.setParams();
    }
  },
  created: function(){
    this.setParams();
  },
  methods:{
    setParams: function(){
      if(this.params[0]) {
        this.heading = this.params[0];
      }
      if(this.params[1]) {
        this.iconClass = normalizeIconClass(this.params[1]);
      }
      if(this.params[2]) {
        this.text = this.params[2];
      }
      if(this.params[3]) {
        this.buttonText = this.params[3];
      }
      if(this.params[4]) {
        this.buttonHref = this.params[4];
      }
      if(this.params[5]) {
        this.buttonCallback = this.params[5];
      }
    }
  },
};
</script>

<style lang="scss">
  @import '../../sass/settings.scss';

  .vue-wizard {
    background-color: $ma-bg-beige;
    border-radius: $ma-border-radius;
    color: $ma-secondary-text;
    .button {
      margin-top: map-get($spacings, large);
    }
    h2 {
      margin: map-get($spacings, medium) 0;
    }
    .icon {
      margin: map-get($spacings, medium);
      color: $ma-primary;
      &:hover {
        color:$ma-primary-hover;
      }
    }
  }
</style>
