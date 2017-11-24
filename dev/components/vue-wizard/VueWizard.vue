<template>
    <div class="vue-wizard">
        <div class="icon"><i class="ma-primaryColor fa fa-4x" v-bind:class="iconClass"></i></div>
        <div>
            <h2 class="ma-primaryColor">{{heading}}</h2>
            <span v-if="text">{{text}}</span>
            <br v-if="text && (buttonHref || buttonCallback) && buttonText" />
            <a class="button primary small" v-on:click="buttonClick" :href="href" v-if="(buttonCallback || buttonHref) && buttonText">{{buttonText}}</a>
        </div>
        <span class="vue-wizard-clear"></span>
    </div>
</template>

<script>
    export default {
        props: {
            icon: {
                default: 'magic',
                type: String,
            },
            text: {
                type: String,
            },
            heading: {
                type: String,
                required: true,
            },
            buttonHref: {
                type: String,
            },
            buttonCallback: {
                type: Function,
            },
            buttonText: {
                type: String,
            }
        },

        data: function() {
            return {
                iconClass: "fa-" + this.icon,
                href: this.buttonHref || '',
            };
        },

        methods: {
            buttonClick: function(event) {
                if(this.buttonCallback) {
                    let result = this.buttonCallback(event);
                    if(!(this.buttonHref && result)) {
                        event.preventDefault();
                    }
                }
            }
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
