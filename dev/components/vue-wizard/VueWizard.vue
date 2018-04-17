<template>
  <div class="vue-wizard">
    <div class="icon"><i
      :class="iconClass"
      class="ma-primary-color fa fa-4x"/></div>
    <div>
      <h2 class="ma-primary-color">{{ heading }}</h2>
      <p v-if="text">{{ text }}</p>
      <vue-button
        v-if="( buttonCallback || buttonHref) && buttonText"
        :title="buttonText"
        :href="buttonHref"
        type="primary"
        @click.native="buttonCallback"
      />
    </div>
    <span class="vue-wizard-clear"/>
  </div>
</template>

<script>
export default {
  props: {
    params: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      iconClass: "fa-magic",
      text: "",
      heading: "",
      buttonHref: "",
      buttonText: "",
      buttonCallback: ""
    };
  },
  watch: {
    params: function() {
      this.iconClass = "fa-magic";
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
        this.iconClass = this.params[1];
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
  .vue-wizard {
    & > div {
      float: left;
    }
    h2 {
      max-width: 370px;
    }
    .button {
      margin-top: 20px;
    }
    .icon {
      padding: 30px;
    }
    .vue-wizard-clear::after {
      content: "";
      clear: left;
      display: table;
    }
  }
</style>
