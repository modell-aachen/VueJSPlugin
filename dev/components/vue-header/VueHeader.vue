<template>
    <div class="vue-header">
        <component
            :is="'h' + scrubbedLevel"
            :class="headerClass"
        >
            <slot/>
            <small
                v-if="sublabel"
                class="sublabel"
            >
                {{ sublabel }}
            </small>
        </component>
    </div>
</template>

<script>
export default {
    props: {
        level: {
            type: [Number, String],
            default: 1,
            validator: this.levelValidator,
        },
        ruler: {
            type: Boolean,
            default: false,
        },
        sublabel: {
            type: String,
            default: undefined,
        },
    },
    computed: {
        scrubbedLevel() {
            // validator only emits a warning
            if(this.levelValidator(this.level)) {
                return this.level;
            } else {
                return 1;
            }
        },
        headerClass() {
            let headerClass = {
                'ma-text-hr': this.ruler,
            };
            headerClass['ma-margin-top-' + (this.level === 3 ? 'medium' : 'large')] = true;
            return headerClass;
        },
    },
    methods: {
        levelValidator: value => {
            return /^[123]$/.test(value);
        },
    }
};
</script>

<style lang="scss">
@import '../../sass/settings.scss';

.vue-header {
  .ruler {
    border-bottom: 1px solid $ma-light-grey;
    width: 128px;
  }
  .sublabel {
    color: $ma-secondary-text;
  }
  h1 {
    margin-bottom: map-get($spacings, large);
  }
  h2, h3 {
    margin-bottom: 0;
  }
}
</style>

