<template>
    <div class="vue-wizard">
        <div class="icon"><i class="ma-primary-color fa fa-4x" v-bind:class="iconClass"></i></div>
        <div>
            <h2 class="ma-primary-color">{{heading}}</h2>
            <span v-if="text">{{text}}</span>
            <br v-if="text && (buttonHref || buttonCallback) && buttonText" />
            <a class="button primary small" v-on:click="buttonClick" :href="buttonHref" v-if="(buttonCallback || buttonHref) && buttonText">{{buttonText}}</a>
        </div>
        <span class="vue-wizard-clear"></span>
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
        methods:{
          buttonClick: function(event) {
            if(this.buttonCallback) {
              let result = this.buttonCallback(event);
              if(!(this.buttonHref && result)) {
                event.preventDefault();
              }
            }
          }
        },
        created: function(){
          if(this.params[0])
            this.heading = this.params[0];
          if(this.params[1])
            this.iconClass = this.params[1];
          if(this.params[2])
            this.text = this.params[2];
          if(this.params[3])
            this.buttonText = this.params[3];
          if(this.params[4])
            this.buttonHref = this.params[4];
          if(this.params[5])
            this.buttonCallback = this.params[5];
        }
    }
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
