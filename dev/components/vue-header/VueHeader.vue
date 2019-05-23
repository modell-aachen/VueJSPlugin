<template>
    <component
        :is="'h' + scrubbedLevel"
        :class="headerClass"
        class="vue-header">
        <slot />
        <i
            v-if="status"
            :class="status"
            class="fas fa-exclamation-triangle ma-status-triangle" />
        <small
            v-if="sublabel"
            class="sublabel">
            {{ sublabel }}
        </small>
    </component>
</template>

<script>
import LevelValidator from "./LevelValidator.js";
export default {
    props: {
        level: {
            type: [Number, String],
            default: 1,
            validator: LevelValidator,
        },
        ruler: {
            type: Boolean,
            default: false,
        },
        sublabel: {
            type: String,
            default: undefined,
        },
        status: {
            type: String,
            default: "",
        },
    },
    computed: {
        scrubbedLevel() {
            // validator only emits a warning
            if(LevelValidator(this.level)) {
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

