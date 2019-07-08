<template>
    <div class="vue-wizard grid-x">
        <div class="cell shrink icon">
            <i
                :class="iconClass" />
        </div>

        <div class="cell auto grid-y">
            <vue-header3 v-if="heading">
                {{ heading }}
            </vue-header3>
            <div class="cell ma-margin-top-medium">
                <div v-if="text">
                    {{ text }}
                </div>
                <div
                    v-if="( buttonCallback || buttonHref) && buttonText"
                    class="ma-margin-top-large">
                    <vue-button
                        ref="actionButton"
                        :title="buttonText"
                        :href="buttonHref"
                        data-test="actionButton"
                        type="primary"
                        @click.native="buttonCallback" />
                </div>
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
            required: true,
        },
    },
    data: function() {
        return {
            iconClass: defaultIcon,
            text: "",
            heading: "",
            buttonHref: "",
            buttonText: "",
            buttonCallback: "",
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
        },
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
        },
    },
};
</script>

<style lang="scss">
  @import '../../sass/settings.scss';

  .flatskin-wrapped .vue-wizard {
    background-color: $ma-bg-beige;
    border-radius: $ma-border-radius;
    &, & h3 {
      color: $ma-secondary-text;
    }
    padding-right: map-get($spacings, large);
    .icon {
      margin: map-get($spacings, medium);
      color: $ma-primary;
    }
  }
</style>
