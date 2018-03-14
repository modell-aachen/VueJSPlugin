<template>
  <div class="dropdown v-userselector" :class="dropdownClasses">
      <div ref="toggle" type="text" class="dropdown-toggle" :style="multiple ? {height: 'initial', margin: 0} : {}" v-bind:class="{multi: multiple}" @mousedown.prevent="toggleDropdown">
      <span class="form-control" v-if="!searchable && isValueEmpty && !open">
        {{ placeholder }}
      </span>
      <div class="input-area">
        <div ref="selectedList" class="selected-list">
          <span class="selected-tag" v-bind:class="{multi: multiple}" v-for="(option,index) in internalValue" v-bind:key="index">
            <template v-if="!multiple && !open">
              <span class="single-tag">{{ getSelectedOptionLabel(option) }}</span>
            </template>
            <a v-if="multiple" @mousedown.stop="select(option)" class="small close button">
              {{ getSelectedOptionLabel(option) }}
              <i class="fa fa-times-circle fa-lg close-icon" aria-hidden="true"></i>
            </a>
          </span>
          <span class="form-control__wrapper">
            <input
              v-show="open || multiple"
              ref="search"
              v-model="search"
              @keyup.esc="onEscape"
              @keydown.up.prevent="typeAheadUp"
              @keydown.down.prevent="typeAheadDown"
              @keyup.enter.prevent="typeAheadSelect"
              @blur="inputHasFocus = false"
              @focus="inputHasFocus = true;"
              type="text"
              :class="{ 'form-control': true, multi: multiple }"
              :placeholder="searchPlaceholder"
              />
          </span>
        </div>
        <div class="open-indicator" v-if="!multiple" style="min-width: 30px; max-width:30px; align-self: center; text-align:right;">
          <i class="fa fa-caret-down" aria-hidden="true" style="margin-right: 10px;"></i>
        </div>
      </div>
    </div>
    <div class="dropdown-menu">
      <div class="vue-userselector__dropdown__filter" @click="focusOnSearch" @mousedown="checkBoxHasFocus = true">
          <input type="checkbox" ref="useUsers" v-model="internalUseUsers" v-if="usersOption" :id="_uid + '_useUsers'" /><label class="vue-userselector__dropdown__filter__item" :for="_uid + '_useUsers'">{{$t('users')}}</label>
          <input type="checkbox" ref="useGroups" v-model="internalUseGroups" v-if="groupsOption" :id="_uid + '_useGroups'" /><label class="vue-userselector__dropdown__filter__item" :for="_uid + '_useGroups'">{{$t('groups')}}</label>
          <input type="checkbox" ref="useMetadata" v-model="internalUseMetadata" v-if="metadataOption" :id="_uid + '_useMetadata'" /><label class="vue-userselector__dropdown__filter__item" :for="_uid + '_useMetadata'">{{$t('metadata')}}</label>
      </div>
      <v-infinite-scroll class="infinite-scroll" :loading="isLoading" @bottom="loadNextPage" :style="{ 'max-height': maxHeight }">
          <ul ref="dropdownMenu" v-show="open" :transition="transition" class="dropdown-menu-list">
            <li v-for="(option,index) in filteredOptions" v-bind:key="index" class="list-item" :class="{ active: isOptionSelected(option), highlight: index === typeAheadPointer }" @mouseover="typeAheadPointer = index" @mousedown.prevent="select(option)">
              <a>
                <span>{{ getOptionLabel(option) }}</span><span v-if="option.type" class="ma-grey-color">&nbsp;({{$t(option.type_label || option.type)}})</span>
              </a>
            </li>
          </ul>
          <vue-spinner v-if="isLoading"></vue-spinner>
      </v-infinite-scroll>
    </div>
  </div>
</template>


<script type="text/babel">
import pointerScroll from '../vue-select/mixins/pointerScroll';
import typeAheadPointer from '../vue-select/mixins/typeAheadPointer';
import ajax from '../vue-select/mixins/ajax';
import debounce from 'lodash/debounce';

const numRows = 10;
const debounceMillis = 150;

export default {
  mixins: [pointerScroll, typeAheadPointer, ajax],
  i18nextNamespace: 'WorkflowAppPlugin',

  props: {
    /**
     * Whether 'metadata' should be in the options.
     */
    useMetadata: {
      default: true,
      type: Boolean,
    },
    /**
     * Whether the user is presented with the 'metadata' checkbox.
     */
    metadataOption: {
      default: true,
      type: Boolean,
    },
    /**
     * Whether 'groups' should be in the options.
     */
    useGroups: {
      default: true,
      type: Boolean,
    },
    /**
     * Whether the user is presented with the 'groups' checkbox.
     */
    groupsOption: {
      default: true,
      type: Boolean,
    },
    /**
     * Whether 'users' should be in the options.
     */
    useUsers: {
      default: true,
      type: Boolean,
    },
    /**
     * Whether the user is presented with the 'users' checkbox.
     */
    usersOption: {
      default: true,
      type: Boolean,
    },
    /**
     * Available metadata options.
     */
    metadata: {
      default: () => [],
      type: Array,
    },

    /**
     * Sets the max-height property on the dropdown list.
     * @deprecated
     * @type {String}
     */
    maxHeight: {
      type: String,
      default: '40vh'
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
    onChange: Function,

    /**
     * When false, updating the options will not reset the select value
     * @type {Boolean}
     */
    resetOnOptionsChange: {
      type: Boolean,
      default: false
    },

    value: {
      type: Array,
      default(){
        return [];
      }
    },
  },

  data() {
    let internalMetadata = this.metadata.slice();
    internalMetadata.sort((a, b) => a.label.localeCompare(b.label));

    return {
      options: [],
      search: '',
      inputHasFocus: false,
      checkBoxHasFocus: false,
      internalMetadata: internalMetadata,
      internalUseGroups: this.useGroups ? true : false,
      internalUseMetadata: this.useMetadata ? true : false,
      internalUseUsers: this.useUsers ? true : false,
      internalValue: [],
      isLoading: false,
      queryUsersGroupsOffset: 0,
      ajaxQueryNr: 0, // Id for the ajax request. Changes, when the query term etc. changes, but does not change for paging. This will prevent any delayed (obsolete) responses from being displayed.
    };
  },

  watch: {
    value() {
      this.internalValue = this.value;
    },
    internalValue(val) {
      this.$emit('input', val);
    },
    options() {
      if (this.resetOnOptionsChange) {
        this.$set('internalValue', []);
      }
    },
    open() {
      if(!this.open) {
        this.search = '';
        return;
      }
      this.updateDropdown();
    },
    search: debounce(function() {
      this.queryUsersGroupsOffset = 0;
      this.updateDropdown();
    }, debounceMillis),
    internalUseUsers() {
      this.updateDropdown();
    },
    internalUseGroups() {
      this.updateDropdown();
    },
    internalUseMetadata() {
      this.updateDropdown();
    },
  },

  methods: {
    loadNextPage() {
      this.isLoading = true;
      this.updateDropdown(true);
    },

    updateDropdown(loadNextPage) {
      if(loadNextPage) {
        // we are loading another page, leave params as they are
      } else {
        this.indexOnMetadata = 0;
        this.queryUsersGroupsOffset = 0;
        this.ajaxQueryNr++;
      }
      let ajaxQueryNr = this.ajaxQueryNr || 0;
      let queryUsersGroupsOffset = this.queryUsersGroupsOffset || 0;
      let indexOnMetadata = this.indexOnMetadata || 0;

      return this.getUsersAndGroups(queryUsersGroupsOffset).then(userGroups => {
        if(ajaxQueryNr !== this.ajaxQueryNr) {
          // another request was triggered, while we were waiting for our response
          return;
        }

        let metadata;
        if(this.internalUseMetadata) {
          metadata = this.internalMetadata.filter(item => item.label.indexOf(this.search) !== -1);
        } else {
          metadata = [];
        }

        let result = [];
        let indexOnUserGroups = 0;

        // Merge metadata and users/groups without changing the order of users/groups (backend might order differently than the browser).
        for(let i = 0; i < numRows; i++) {
          let userGroup = userGroups[indexOnUserGroups];
          let metadatum = metadata[indexOnMetadata];
          if(!userGroup && !metadatum) {
            break;
          }
          if(
            !metadatum
            || (userGroup && userGroup.label.toLocaleLowerCase().localeCompare(metadatum.label.toLocaleLowerCase()) < 0)
          ) {
            result.push(userGroup);
            indexOnUserGroups++;
          } else {
            result.push(metadatum);
            indexOnMetadata++;
          }
        }

        if(loadNextPage) {
          this.options = this.options.concat(result);
        } else {
          this.options = result;
        }

        this.isLoading = false;
        this.queryUsersGroupsOffset = queryUsersGroupsOffset + indexOnUserGroups;
        this.indexOnMetadata = indexOnMetadata;
      });
    },

    getUsersAndGroups(queryUsersGroupsOffset) {
      let useGroups = this.internalUseGroups;
      let useUsers = this.internalUseUsers;
      let search = this.search;

      // only present metadata when search is empty
      if(!this.search.length || (!useUsers && !useGroups)) {
        this.lastAjax = null;
        return Promise.resolve([]);
      }

      if(this.lastSearch === search && this.lastUseGroups === useGroups && this.lastUseUsers === useUsers && this.lastOffset === queryUsersGroupsOffset && this.lastAjax) {
        return Promise.resolve(this.lastAjax.data);
      }

      let type;
      if(this.internalUseUsers && this.internalUseGroups) {
        type = 'any';
      } else if(this.internalUseUsers) {
        type = 'user';
      } else {
        type = 'group';
      }

      return this.makeAjaxRequest({
        name: 'QUERYUSERS',
        urlparam: 'term', // page only works, if urlparam is set
        term: this.search,
        offset: queryUsersGroupsOffset,
        type: type,
        limit: numRows,
        header: '{$quotdata$quot:[',
        separator: ',',
        footer: '],$quotcount$quot:$quot$count$quot}',
        format: '{$quotlabel$quot:$quot$displayName$quot,$quotvalue$quot:$quot$cUID$quot,$quottype$quot:$quotuser$quot}',
        groupformat: '{$quotlabel$quot:$quot$displayName$quot,$quotvalue$quot:$quot$wikiName$quot,$quottype$quot:$quotgroup$quot}',
      }).then(json => {
        this.lastAjax = json;
        this.lastOffset = queryUsersGroupsOffset;
        this.lastUseGroups = useGroups;
        this.lastUseUsers = useUsers;
        this.lastSearch = search;
        return this.lastAjax.data;
      });
    },

    makeAjaxRequest(params) { // this method is here to simplify karma mocks
      return this.$http.get(
        this.$foswiki.getScriptUrl('rest', 'RenderPlugin', 'tag'),
        {
          params
        }
      ).then(res => {
        return res.json(); // for some reason jsonp did not work
      });
    },

    /**
     * Select a given option.
     * @param  {Object||String} option
     * @return {void}
     */
    select(option) {
      if (this.isOptionSelected(option)) {
        this.deselect(option);
      } else {
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
        this.$refs.search.blur();
      }

      if (this.clearSearchOnSelect) {
        this.search = '';
      }
    },

    focusOnSearch() {
      this.$refs.search.focus();
      this.checkBoxHasFocus = false;
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
        this.inputHasFocus = true;
        this.search = ''; // or insert the old display value?
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
  },

  computed: {
    open() {
      return this.inputHasFocus || this.checkBoxHasFocus;
    },

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
      let options = this.options || [];
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
  created() {
    this.internalValue = this.value;
  }

};
</script>

<style lang="scss">
.v-userselector .dropdown-menu {
  overflow-y: auto;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: none;
  float: left;
  min-width: 160px;
  padding: 5px 0 0 0;
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
    margin-bottom: 0px;
    .list-item {
      border: none;
      padding: 3px 5px;
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
}
.v-userselector .open>.dropdown-menu {
  display: block;
}
.v-userselector {
  position: relative;
  margin: 0 0 1rem;
  height: 100%;
}

.v-userselector .open-indicator {
  padding: 0.85em 1em; /* XXX copied from flatskin */
  vertical-align: middle;
  width: 1%;
  white-space: nowrap;
  .button {
    margin: 0;
    width: 30px;
    height: 30px;
  }
}

.v-userselector .dropdown-toggle {
  padding: 0;
  white-space: normal;
  min-height: 2.4375rem;
  width: 100%;
}

.v-userselector.searchable .dropdown-toggle {
  cursor: text;
}

.v-userselector.open .dropdown-toggle {
  border-bottom: none;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.v-userselector > .dropdown-menu {
  margin: 0;
  margin-top: 2px;
  width: 100%;
  overflow-y: auto;
}

.v-userselector .selected-tag {
  margin: 2px;
  white-space: nowrap;
  flex: initial;
  float: left;
  .close-icon {
    margin-left: 3px;
  }
  .button {
    margin: 0px;
  }
  &:not(.multi) {
    margin: 0;
  }
}

.v-userselector input[type=search],
.v-userselector input[type=search]:focus {
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

.v-userselector input[type=search]:disabled {
  cursor: pointer;
}

.v-userselector li a {
  cursor: pointer;
}

.v-userselector .selected-list {
  height: 100%;
}
.v-userselector .form-control__wrapper {
  display:block;
  flex: 1 1 auto;
}
.v-userselector .form-control {
  margin-bottom: 0px;
  min-width: 100px;
  width: 100%,
  &:not(.multi) {
    padding-top: 0px;
    padding-bottom: 0px;
  }
}
.v-userselector .single-tag {
  padding: 0.85em 1em; /* XXX copied from flatskin */
  display: inline-block;
}
.v-userselector [type="text"] {
  height: auto;
}
.v-userselector .input-area {
  display: flex;
  flex-flow: row no-wrap;
  width:100%;
}
.v-userselector .selected-list {
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  height:100%;
  align-self: center;
}
.v-userselector .infinite-scroll {
  overflow-y: scroll;
}
</style>
