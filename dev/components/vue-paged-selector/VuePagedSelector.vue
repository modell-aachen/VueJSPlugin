<template>
  <div class="vue-paged-selector">
    <vue-input-text
      v-model="filter"
      :label="filterLabel"
      :placeholder="filterPlaceholder"
      name="filterOptions"
    />

    <div class="grid-container fluid">
      <div
        v-for="option in displayedOptions"
        :key="option.key"
      >
        <vue-check-item
          :value="option.value"
          :description="option.description"
          :badge="option.badge"
          v-model="internalValue"
          type="radio"
        >
          {{ option.label }}
        </vue-check-item>
      </div>
      <vue-pagination
        v-model="page"
        :page-count="pageCount"
      />
    </div>
  </div>
</template>

<script>
const itemsPerPage = 5;

export default {
  props: {
    filterLabel: {
      type: String,
      default: undefined,
    },
    filterPlaceholder: {
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
    let internalOptions = this.transformOptionsToFilterList(this.options);
    return {
      filter: '',
      page: 1,
      internalOptions,
      internalValue: this.value,
      filteredOptions: internalOptions,
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.filteredOptions.length / itemsPerPage);
    },
    displayedOptions() {
      let start = Math.min((this.page - 1) * itemsPerPage, this.filteredOptions.length);
      let end = Math.min(start + itemsPerPage, this.filteredOptions.length);
      return this.filteredOptions.slice(start, end);
    },
  },
  watch: {
    internalValue() {
      this.$emit('input', this.internalValue);
    },
    options() {
      this.internalOptions = this.transformOptionsToFilterList(this.options);
      this.filteredOptions = this.internalOptions;
    },
    filter() {
      this.page = 1;
      let filter = this.filter.toLocaleLowerCase();
      let options = this.internalOptions.filter(option => option.compare.indexOf(filter) !== -1);
      this.filteredOptions = options;
    },
  },
  methods: {
    transformOptionsToFilterList(options) {
      let serial = 0;
      return options.map(option => {
        let compare = (option.label || '').toLocaleLowerCase();
        return {
          key: ++serial,
          value: option.value,
          label: option.label,
          badge: option.badge,
          description: option.description !== undefined ? option.description : '',
          compare: compare,
        };
      });
    },
  },
};
</script>

<style lang="scss">
@import '../../sass/settings.scss';

.vue-paged-selector {
}
</style>


