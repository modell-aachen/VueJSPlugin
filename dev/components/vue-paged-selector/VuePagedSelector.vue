<template>
  <div class="vue-paged-selector">
    <vue-input-text v-model="search" :label="label" :placeholder="placeholder"></vue-input-text>

    <div>
      <vue-pagination
        v-model="page"
        :pageCount="pageCount"
      >
        <div v-for="option in filteredOptions" class="grid-x">
          <div class="cell auto">
            <vue-check-item type="radio" :value="option.value" v-model="internalValue">
              <b>{{ option.label }}</b>
              <div
                v-if="option.description"
                class="ma-margin-top-small"
              >
                {{ option.description }}
              </div>
            </vue-check-item>
          </div>
          <div class="cell shrink">
            <span v-if="option.badge">{{ option.badge }}</span>
          </div>
        </div>
      </vue-pagination>
    </div>
  </div>
</template>

<script>
const itemsPerPage = 5;

export default {
  props: {
    label: {
      type: String,
      default: undefined,
    },
    placeholder: {
      type: String,
      default: undefined,
    },
    options: {
      type: Array,
      default: () => [],
      required: true,
    },
    value: {
      String,
      default: '',
    },
  },
  data() {
    let internalOptions = this.options.map(option => {
      let compare = (option.label || '').toLocaleLowerCase();
      return {
        value: option.value,
        label: option.label,
        badge: option.badge,
        description: option.description && option.description.length ? option.description : undefined,
        compare: compare,
      };
    });
    return {
      search: '',
      page: 0,
      internalOptions,
      internalValue: this.value,
    };
  },
  watch: {
    internalValue() {
      this.$emit('input', this.internalValue);
    },
  },
  computed: {
    filteredOptions() {
      let search = this.search.toLocaleLowerCase();
      let options = this.internalOptions.filter(option => option.compare.indexOf(search) !== -1);
      return options;
    },
    pageCount() {
      return Math.ceil(this.filteredOptions.length / itemsPerPage);
    },
  },
  methods: {
  }
};
</script>

<style lang="scss">
@import '../../sass/settings.scss';

.vue-paged-selector {
}
</style>


