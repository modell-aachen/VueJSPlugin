<template>
  <div class="vue-paged-selector">
    <vue-input-text
      v-model="search"
      :label="label"
      :placeholder="placeholder" />
    <div>
      <vue-pagination
        v-model="page"
        :page-count="pageCount"
      >
        <div
          v-for="option in filteredOptions"
          :key="option.value"
          class="grid-x"
        >
          <div class="cell auto">
            <vue-check-item
              v-model="internalValue"
              :value="option.value"
              type="radio">
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
      type: String,
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
  watch: {
    internalValue() {
      this.$emit('input', this.internalValue);
    },
  },
  methods: {
  }
};
</script>

<style lang="scss">
@import '../../sass/settings.scss';
</style>


