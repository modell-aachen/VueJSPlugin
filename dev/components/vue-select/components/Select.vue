<style lang="scss">
    .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1000;
        display: none;
        float: left;
        min-width: 160px;
        padding: 5px 0;
        margin: 2px 0 0;
        font-size: 14px;
        text-align: left;
        background-color: #fff;
        -webkit-background-clip: padding-box;
        background-clip: padding-box;
        border: 1px solid #ccc;
        border: 1px solid rgba(0,0,0,.15);
        border-radius: 4px;
        -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
        box-shadow: 0 6px 12px rgba(0,0,0,.175);
        .dropdown-menu-list {
            list-style: none;
            list-style-image: none !important;
            padding: 0;
            .list-item {
                border-bottom: 1px solid lightgrey;
                padding: 0 0 10px 0;
                cursor: pointer;
                &.highlight,
                &.active {
                    background-color: lightgrey;
                }
                a {
                    margin: 5px;
                }
            }
        }
        .divider {
            height: 1px;
            margin: 9px 0;
            overflow: hidden;
            background-color: #e5e5e5;
        }
    }
    .open>.dropdown-menu {
        display: block;
    }
    .v-select {
        position: relative;
        margin: 0 0 1rem;
        border: 1px solid #e5e8eb;
        border-radius: 4px;
        height: 100%;
        &.multi {
            border: 2px solid #e5e8eb;
        }
    }

    .v-select .open-indicator {
        vertical-align: middle;
        width: 1%;
        white-space: nowrap;
        .button {
            margin: 0;
            width: 30px;
            height: 30px;
        }
    }

    .v-select .dropdown-toggle {
        padding: 0;
        white-space: normal;
        min-height: 2.4375rem;
        width: 100%;
        background-color: #e5e8eb;
        border-radius: 4px;
        &.multi{
            background-color: white;
        }
    }

    .v-select.searchable .dropdown-toggle {
        cursor: text;
    }

    .v-select.open .dropdown-toggle {
        border-bottom: none;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    .v-select > .dropdown-menu {
        margin: 0;
        width: 100%;
        overflow-y: auto;
        border-top: none;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    .v-select .selected-tag {
        margin: 2px;
        float: left;
        .close-icon {
            margin-left: 3px;
        }
        .button {
            margin: 0px;
        }
        &:not(.multi) {
            margin-left: 5px;
            margin-top: 5px;
        }
    }

    .v-select input[type=search],
    .v-select input[type=search]:focus {
        display: inline-block;
        border: none;
        outline: none;
        margin: 0;
        padding: 0 .5em;
        width: 10em;
        max-width: 100%;
        background: none;
        position: relative;
        box-shadow: none;
        clear: none;
    }

    .v-select input[type=search]:disabled {
        cursor: pointer;
    }

    .v-select li a {
        cursor: pointer;
    }

    .v-select .selected-list {
        height: 100%;
    }

</style>

<template>
  <div
    :class="dropdownClasses"
    class="dropdown v-select">
    <div
      ref="toggle"
      :class="{multi: multiple}"
      class="dropdown-toggle"
      @mousedown.prevent="toggleDropdown">
      <span
        v-if="!searchable && isValueEmpty"
        class="form-control">
        {{ placeholder }}
      </span>

      <div style="display: flex; flex-flow: row no-wrap; width:100%; min-height:2.25rem; height:100%; padding: 2px;">
        <div
          ref="selectedList"
          style="flex-grow: 1; height:100%; min-height:2.1rem; align-self: center">
          <span
            v-for="(option,index) in internalValue"
            :key="index"
            :class="{multi: multiple}"
            class="selected-tag">
            <template v-if="!multiple">
              {{ getSelectedOptionLabel(option) }}
            </template>
            <a
              v-if="multiple"
              class="small close button"
              @mousedown.stop="select(option)">
              {{ getSelectedOptionLabel(option) }}
              <i
                class="fa fa-times-circle fa-lg close-icon"
                aria-hidden="true"/>
            </a>
          </span>
        </div>
        <div
          class="open-indicator"
          style="min-width: 30px; max-width:30px; align-self: center; text-align:right;">
          <template v-if="multiple">
            <a
              ref="openIndicator"
              class="tiny primary button">
              <i
                v-show="!loading"
                class="fa fa-plus"
                aria-hidden="true"/>
              <slot name="spinner">
                <i
                  v-show="loading"
                  class="fa fa-circle-o-notch fa-spin fa-lg spinner"/>
              </slot>
            </a>
          </template>
          <template v-else>
            <i
              class="fa fa-caret-down"
              aria-hidden="true"
              style="margin-right: 10px;"/>
          </template>
        </div>
      </div>





    </div>
    <div class="dropdown-menu">
      <input
        v-show="searchable"
        ref="search"
        :style="{ width: '100%' }"
        :debounce="debounce"
        v-model="search"
        :placeholder="searchPlaceholder"
        type="search"
        class="form-control"
        @keydown.delete="maybeDeleteValue"
        @keyup.esc="onEscape"
        @keydown.up.prevent="typeAheadUp"
        @keydown.down.prevent="typeAheadDown"
        @keyup.enter.prevent="typeAheadSelect"
        @blur="open = false"
        @focus="open = true"
      >
      <ul
        v-show="open"
        ref="dropdownMenu"
        :transition="transition"
        :style="{ 'max-height': maxHeight }"
        class="dropdown-menu-list">
        <li
          v-for="(option,index) in filteredOptions"
          :key="index"
          :class="{ active: isOptionSelected(option), highlight: index === typeAheadPointer }"
          class="list-item"
          @mouseover="typeAheadPointer = index"
          @mousedown.prevent="select(option)">
          <a>
            {{ getOptionLabel(option) }}
          </a>
        </li>
        <li
          v-if="!filteredOptions.length"
          class="divider"/>
        <li
          v-if="!filteredOptions.length"
          style="text-align: center;"
          class="text-center">
          <slot name="no-options">Sorry, no matching options.</slot>
        </li>
        <li
          v-if="onGetMoreOptions && filteredOptions.length"
          style="text-align: center;"
          class="text-center">
          <a @mousedown.prevent="addMoreOptions">
            <slot name="more-results">Click to get more results.</slot>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>


<script type="text/babel">
import pointerScroll from '../mixins/pointerScroll';
import typeAheadPointer from '../mixins/typeAheadPointer';
import ajax from '../mixins/ajax';

export default {
  mixins: [pointerScroll, typeAheadPointer, ajax],

  props: {
    /**
         * Contains the currently selected value. Very similar to a
         * `value` attribute on an <input>. In most cases, you'll want
         * to set this as a two-way binding, using :value.sync. However,
         * this will not work with Vuex, in which case you'll need to use
         * the onChange callback property.
         * @type {Object||String||null}
         */
    initialValue: {
      type: [Object,String],
      default: null
    },

    /**
 * An array of strings or objects to be used as dropdown choices.
 * If you are using an array of objects, vue-select will look for
 * a `label` key (ex. [{label: 'This is Foo', value: 'foo'}]). A
 * custom label key can be set with the `label` prop.
 * @type {Object}
 */
    options: {
      type: Array,
      default() {
        return [];
      },
    },

    /**
 * Sets the max-height property on the dropdown list.
 * @deprecated
 * @type {String}
 */
    maxHeight: {
      type: String,
      default: '400px'
    },

    /**
 * Enable/disable filtering the options.
 * @type {Boolean}
 */
    searchable: {
      type: Boolean,
      default: true
    },

    /**
 * Equivalent to the `multiple` attribute on a `<select>` input.
 * @type {Object}
 */
    multiple: {
      type: Boolean,
      default: false
    },

    /**
 * Equivalent to the `placeholder` attribute on an `<input>`.
 * @type {Object}
 */
    placeholder: {
      type: String,
      default: ''
    },

    /**
 * Sets a Vue transition property on the `.dropdown-menu`. vue-select
 * does not include CSS for transitions, you'll need to add them yourself.
 * @type {String}
 */
    transition: {
      type: String,
      default: 'expand'
    },

    /**
 * Enables/disables clearing the search text when an option is selected.
 * @type {Boolean}
 */
    clearSearchOnSelect: {
      type: Boolean,
      default: true
    },

    /**
 * Tells vue-select what key to use when generating option
 * labels when each `option` is an object.
 * @type {String}
 */
    label: {
      type: String,
      default: 'label'
    },

    /**
 * Callback to generate the label text. If {option}
 * is an object, returns option[this.label] by default.
 * @param  {Object || String} option
 * @return {String}
 */
    getOptionLabel: {
      type: Function,
      default(option) {
        if (typeof option === 'object') {
          if (this.label && option[this.label]) {
            return option[this.label];
          }
        }
        return option;
      }
    },

    getSelectedOptionLabel: {
      type: Function,
      default(option) {
        return this.getOptionLabel(option);
      }
    },

    /**
 * An optional callback function that is called each time the selected
 * value(s) change. When integrating with Vuex, use this callback to trigger
 * an action, rather than using :value.sync to retreive the selected value.
 * @type {Function}
 * @default {null}
 */
    onChange: {
      type: Function,
      default: null
    },

    onGetMoreOptions: {
      type: Function,
      default: null
    },

    onOpen: {
      type: Function,
      default: null
    },

    /**
 * Enable/disable creating options from searchInput.
 * @type {Boolean}
 */
    taggable: {
      type: Boolean,
      default: false
    },

    /**
 * When true, newly created tags will be added to
 * the options list.
 * @type {Boolean}
 */
    pushTags: {
      type: Boolean,
      default: false
    },

    /**
 * User defined function for adding Options
 * @type {Function}
 */
    createOption: {
      type: Function,
      default: function (newOption) {
        if (typeof this.options[0] === 'object') {
          return {[this.label]: newOption};
        }
        return newOption;
      }
    },

    /**
 * When false, updating the options will not reset the select value
 * @type {Boolean}
 */
    resetOnOptionsChange: {
      type: Boolean,
      default: false
    },

    preventSearchFilter: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default(){
        return [];
      }
    }
  },

  data() {
    return {
      search: '',
      open: false,
      internalValue: []
    };
  },

  computed: {

    /**
           * Classes to be output on .dropdown
           * @return {Object}
           */
    dropdownClasses() {
      return {
        open: this.open,
        searchable: this.searchable,
        loading: this.loading,
        multi: this.multiple
      };
    },

    /**
 * Return the placeholder string if it's set
 * & there is no value selected.
 * @return {String} Placeholder text
 */
    searchPlaceholder() {
      if (this.placeholder) {
        return this.placeholder;
      }
    },

    /**
 * The currently displayed options, filtered
 * by the search elements value. If tagging
 * true, the search text will be prepended
 * if it doesn't already exist.
 *
 * @return {array}
 */
    filteredOptions() {
      let options;
      let self = this;
      if(this.preventSearchFilter) {
        options = this.options;
      } else {
        options = this.options.filter(function(option) {
          return option.indexOf(self.search) !== -1;
        });
      }
      // options = this.$options.filters.filterBy(this.options, this.search)
      if (this.taggable && this.search.length && !this.optionExists(this.search)) {
        options.unshift(this.search);
      }
      return options;
    },

    /**
 * Check if there aren't any options selected.
 * @return {Boolean}
 */
    isValueEmpty() {
      if (this.internalValue) {
        if (typeof this.internalValue === 'object') {
          return !Object.keys(this.internalValue).length;
        }
        return !this.internalValue.length;
      }

      return true;
    }
  },

  watch: {
    value() {
      this.internalValue = this.value;
    },
    internalValue(val) {
      this.$emit('input', val);
    },
    options() {
      if (!this.taggable && this.resetOnOptionsChange) {
        this.$set('internalValue', []);
      }
    },
    open(){
      if(this.open && this.onOpen){
        this.onOpen(this.search, this.loading);
      }
    }
  },
  created() {
    this.internalValue = this.value;
  },

  methods: {

    /**
           * Select a given option.
           * @param  {Object||String} option
           * @return {void}
           */
    select(option) {
      if (this.isOptionSelected(option)) {
        this.deselect(option);
      } else {
        if (this.taggable && !this.optionExists(option)) {
          option = this.createOption(option);

          if (this.pushTags) {
            this.options.push(option);
          }
        }

        if (this.multiple) {
          if (!this.internalValue) {
            this.internalValue = [option];
          } else {
            this.internalValue.push(option);
          }
        } else {
          this.internalValue = [option];
        }
      }

      this.onAfterSelect(option);
    },

    /**
 * De-select a given option.
 * @param  {Object||String} option
 * @return {void}
 */
    deselect(option) {
      if (this.multiple) {
        let ref = -1;
        this.internalValue.forEach((val) => {
          if (val === option || typeof val === 'object' && val[this.label] === option[this.label]) {
            ref = val;
          }
        });
        let index = this.internalValue.indexOf(ref);
        this.internalValue.splice(index, 1);
      } else {
        this.internalValue = null;
      }
    },

    /**
 * Called from this.select after each selection.
 * @param  {Object||String} option
 * @return {void}
 */
    onAfterSelect() {
      if (!this.multiple) {
        this.open = !this.open;
        this.$refs.search.blur();
      }

      if (this.clearSearchOnSelect) {
        this.search = '';
      }
    },

    /**
 * Toggle the visibility of the dropdown menu.
 * @param  {Event} e
 * @return {void}
 */
    toggleDropdown() {
      if (this.open) {
        this.$refs.search.blur(); // dropdown will close on blur
      } else {
        this.open = true;
        this.$nextTick(function() {
          //This only works when the search field is visible.
          //That's why we wait for the next tick.
          this.$refs.search.focus();
        });
      }
    },

    /**
 * Check if the given option is currently selected.
 * @param  {Object||String}  option
 * @return {Boolean}         True when selected || False otherwise
 */
    isOptionSelected(option) {
      if (this.multiple && this.internalValue) {
        let selected = false;
        this.internalValue.forEach(opt => {
          if (typeof opt === 'object' && opt[this.label] === option[this.label]) {
            selected = true;
          } else if (opt === option) {
            selected = true;
          }
        });
        return selected;
      }

      return this.internalValue === option;
    },

    /**
 * If there is any text in the search input, remove it.
 * Otherwise, blur the search input to close the dropdown.
 * @return {[type]} [description]
 */
    onEscape() {
      if (!this.search.length) {
        this.$refs.search.blur();
      } else {
        this.search = '';
      }
    },

    /**
 * Delete the value on Delete keypress when there is no
 * text in the search input, & there's tags to delete
 * @return {this.internalValue}
 */
    maybeDeleteValue() {
    // if (!this.$refs.search.value.length && this.internalValue) {
      // 	return this.multiple ? this.internalValue.pop() : this.$set('internalValue', null)
    // }
    },

    /**
 * Determine if an option exists
 * within this.options array.
 *
 * @param  {Object || String} option
 * @return {boolean}
 */
    optionExists(option) {
      let exists = false;

      this.options.forEach(opt => {
        if (typeof opt === 'object' && opt[this.label] === option) {
          exists = true;
        } else if (opt === option) {
          exists = true;
        }
      });

      return exists;
    },
    addMoreOptions() {
      this.onGetMoreOptions(this.search, this.toggleLoading);
    }
  },

};
</script>
