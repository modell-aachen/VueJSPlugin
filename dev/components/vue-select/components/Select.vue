<template>
    <div
        :class="getClasses"
        class="dropdown v-select">
        <label
            v-if="label"
            class="input-label">{{ label }}</label>
        <input
            v-validate="validate"
            v-if="name.length"
            :name="name"
            :value="stringifiedValue"
            type="hidden">
        <div
            ref="toggle"
            :class="getToggleClasses"
            class="dropdown-toggle"
            type="text"
            @mousedown.prevent="toggleDropdown">
            <div
                :class="{ 'input-area-small': isSmall }"
                class="input-area">
                <div
                    ref="selectedList"
                    class="selected-list">
                    <input
                        v-show="!multiple && isValueEmpty && !open"
                        :placeholder="searchPlaceholder"
                        class="single-tag"
                        type="text">

                    <span
                        v-for="(option,index) in internalValue"
                        :class="{multi: multiple, badge: multiple}"
                        :key="index"
                        class="selected-tag">
                        <template v-if="!multiple && !open">
                            <span
                                class="single-tag"
                                type="text">
                                {{ getOptionLabel(option) }}
                            </span>
                        </template>
                        <a
                            v-if="multiple">
                            {{ getOptionLabel(option) }}
                            <i
                                class="far fa-times close-icon"
                                aria-hidden="true"
                                @mousedown.stop="deselect(option)"/>
                        </a>
                    </span>
                    <span class="form-control__wrapper">
                        <input
                            v-show="open || multiple"
                            ref="search"
                            v-model="search"
                            :class="{ 'form-control': true, multi: multiple, 'input-area-small': isSmall }"
                            :placeholder="isValueEmpty ? searchPlaceholder : ''"
                            type="text"
                            @keyup.esc="onEscape"
                            @keydown.up.prevent="typeAheadUp"
                            @keydown.down.prevent="typeAheadDown"
                            @keydown.enter.prevent
                            @keyup.enter.prevent="typeAheadSelect"
                            @blur="inputHasFocus = false"
                            @focus="inputHasFocus = true;">
                    </span>
                </div>
                <div
                    v-if="!isValueEmpty && !multiple && (allowClear === true || allowClear === '1')"
                    class="close-icon close-icon-single-tag"
                    @mousedown.stop
                    @click.stop="deselect(internalValue)">
                    <i class="fas fa-times-circle" />
                </div>
                <div
                    v-if="!multiple && (isValueEmpty || (allowClear !== true && allowClear !== '1'))"
                    class="open-indicator"
                    style="min-width: 30px; max-width:30px; align-self: center; text-align:right;">
                    <i
                        class="select-arrow fa fa-caret-down"
                        aria-hidden="true"/>
                </div>
            </div>
        </div>
        <div
            v-show="open"
            class="dropdown-menu">
            <div
                v-if="!hideOptions && internalFilterOptions.length"
                class="vue-select__dropdown__filter"
                @click="focusOnSearch"
                @mousedown="checkBoxHasFocus = true">
                <span
                    v-for="item in internalFilterOptions"
                    ref="filterItems"
                    :key="item.name">
                    <input
                        :id="_uid + item.name"
                        v-model="checkedFilterOptions[item.name]"
                        type="checkbox">
                    <label
                        :for="_uid + item.name"
                        class="vue-select__dropdown__filter__item">
                        {{ item.label || '?' }}
                    </label>
                </span>
            </div>
            <v-infinite-scroll
                :loading="isLoading"
                :style="{ 'max-height': maxHeight }"
                class="infinite-scroll"
                @bottom="loadNextPage">
                <ul
                    v-show="open"
                    ref="dropdownMenu"
                    :transition="transition"
                    class="dropdown-menu-list">
                    <li
                        v-for="(option,index) in filteredOptions"
                        :key="option.optionLabel"
                        :class="{ active: isOptionSelected(option), highlight: index === typeAheadPointer }"
                        class="list-item"
                        @mouseover="typeAheadPointer = index"
                        @mousedown.prevent="toggle(option)">
                        <a>
                            <span>{{ getOptionLabel(option) }}</span><span
                                v-if="option.type"
                                class="ma-grey-color">&nbsp;({{ $t(option.typeLabel || option.type) }})</span>
                        </a>
                    </li>
                </ul>
                <vue-spinner v-if="isLoading"/>
            </v-infinite-scroll>
        </div>
        <template v-if="hasError" >
            <small class="ma-failure" >{{ definedErrorMessage }}</small>
        </template>
        <small
            v-if="sublabel"
            class="sublabel ma-tertiary-text">
            {{ sublabel }}
        </small>
    </div>

</template>


<script>
import pointerScroll from '../mixins/pointerScroll';
import typeAheadPointer from '../mixins/typeAheadPointer';
import ajax from '../mixins/ajax';
import slotOptions from '../mixins/slotOptions';

const debounceMillis = 150;

export default {
    mixins: [pointerScroll, typeAheadPointer, ajax, slotOptions],
    i18nextNamespace: 'VueJSPlugin',

    props: {
        isSmall: {
            type: Boolean,
            default: false,
        },
        widthClass: {
            type: String,
            default: "",
        },
        value: {
            type: Array,
            default: () => [],
        },
        label: {
            type: String,
            default: undefined
        },
        /**
     * If set, this component will create an input element with this name and
     * the value synchronized to the selection. Meaning this element can be
     * submitted in a form.
     */
        name: {
            type: String,
            default: 'noname',
        },
        /**
     * Sets the max-height property on the dropdown list.
     * @deprecated
     */
        maxHeight: {
            type: String,
            default: '40vh'
        },

        /**
     * Equivalent to the `multiple` attribute on a `<select>` input.
     */
        multiple: {
            type: Boolean,
            default: false
        },

        /**
     * Equivalent to the `placeholder` attribute on an `<input>`.
     */
        placeholder: {
            type: String,
            default: ''
        },

        /**
     * Sets a Vue transition property on the `.dropdown-menu`. vue-select
     * does not include CSS for transitions, you'll need to add them yourself.
     */
        transition: {
            type: String,
            default: 'expand'
        },

        /**
     * Enables/disables clearing the search text when an option is selected.
     */
        clearSearchOnSelect: {
            type: Boolean,
            default: true
        },

        /**
     * These options are available initially. They may be replaced later on
     * (eg. ajax) and are not reactive.
     */
        initialOptions: {
            type: Array,
            default: () => [],
        },

        /**
     * Tells vue-select what key to use when generating option
     * optionLabels when each `option` is an object.
     */
        optionLabel: {
            type: String,
            default: 'label'
        },

        /**
     * Callback to generate the label text. If {option}
     * is an object, returns option[this.optionLabel] by default.
     * @return {String}
     */
        getOptionLabel: {
            type: Function,
            default(option) {
                if (typeof option === 'object') {
                    if (this.optionLabel && option[this.optionLabel]) {
                        return option[this.optionLabel];
                    }
                }
                return option;
            }
        },

        /**
     * An optional callback function that is called each time the selected
     * value(s) change. When integrating with Vuex, use this callback to trigger
     * an action, rather than using :value.sync to retreive the selected value.
     */
        onChange: {
            type: Function,
            default: null
        },

        /**
     * When false, updating the options will not reset the select value
     */
        resetOnOptionsChange: {
            type: Boolean,
            default: false
        },

        dataLimit: {
            type: Number,
            default: 10,
        },
        /**
     * Set to true/1, if the select may be reset to "no selection".
     * Only applies to non-multi selects.
     */
        allowClear: {
            type: [Boolean, String],
            default: false,
        },
        /**
     * Set to true/1, if the user should be able to create new tags.
     */
        dataTags: {
            type: [Boolean, String],
            default: false,
        },

        /**
         * Set to true, if this component/input should be disabled
        */
        isDisabled: {
            type: Boolean,
            default: false,
        },
        /**
        * Set validation according to vee-validate, e.g. 'required'.
        * Validation requires name to be set.
        */
        validate: {
            type: String,
            default: ''
        },
        /**
        * Set validation error message
        */
        sublabel: {
            type: String,
            default: undefined,
        },
    },

    data() {
        let internalFilterOptions = this.getFilterOptions() || [];
        let checkedFilterOptions = {};
        for(let filter of internalFilterOptions) {
            checkedFilterOptions[filter.name] = filter.unchecked ? 0 : 1;
        }

        let taggable = (this.dataTags === true || this.dataTags === '1') ? true : false;

        return {
            options: [],
            search: '',
            taggable,
            inputHasFocus: false,
            checkBoxHasFocus: false,
            internalFilterOptions,
            checkedFilterOptions,
            stringifiedValue: "",
            isLoading: false,
            ajaxQueryNr: 0, // Id for the ajax request. Changes, when the query term etc. changes, but does not change for paging. This will prevent any delayed (obsolete) responses from being displayed.
        };
    },
    inject: ['$validator'],
    computed: {
        internalValue: {
            get() {
                return this.value.slice();
            },
            set(internalValue){
                this.$emit('input', internalValue);
            }
        },
        hideOptions() {
            return true;
        },
        open() {
            return this.inputHasFocus || this.checkBoxHasFocus;
        },
        hasError: function(){
            return this.validationErrors.has(this.name);
        },
        definedErrorMessage: function() {
            return this.validationErrors.first(this.name);
        },
        getClasses() {
            return {
                ['width-'+this.widthClass]: this.widthClass
            };
        },
        getToggleClasses() {
            return {
                'open': this.open,
                'loading': this.loading,
                'multi': this.multiple,
                'ma-failure': this.hasError
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
        },
    },
    watch: {
        stringifiedValue(value){
            if( this.name ) {
                this.validateValue(value);
            }
        },
        internalValue() {
            if(this.name.length) {
                this.stringifiedValue = this.stringifyValue(this.internalValue);
            }
        },
        open() {
            if(!this.open) {
                this.search = '';
                this.validateValue(this.stringifiedValue);
                return;
            }
            this.updateDropdown();
        },
        search() {
            Vue.debounce(() => {
                this.updateDropdown();
            }, debounceMillis)();
        },
        isDisabled() {
            this._disable();
        },
    },
    mounted() {
        this.$emit('input', this.internalValue);
        //check if component should be disabled (already)
        if( this.isDisabled ){
            this._disable();
        }
    },
    created() {
        let internalFilterOptions = this.internalFilterOptions || this.getFilterOptions() || [];
        for(let filter of internalFilterOptions) {
            this.$watch('checkedFilterOptions.' + filter.name, () => {
                this.updateDropdown();
            });
        }
        this.$watch('options', function() {
            if (this.resetOnOptionsChange) {
                this.$set('internalValue', []);
            }
        });
    },

    methods: {
        stringifyValue(val) {
            if(!val) {
                return '';
            }
            if(typeof(val) === 'string') {
                return val;
            }
            let valueMapped = val.map(item => typeof(item) === 'string' ? item : "1");
            return valueMapped.join(',');
        },
        validateValue(value){
            if( this.name ) {
                return this.$validator.validate(this.name, value);
            }
        },
        reset(){
            if(this.internalValue){
                this.internalValue = [];
            }
        },
        getFilterOptions() {
            return [];
        },

        loadNextPage() {
            this.isLoading = true;
            this.updateDropdown(true);
        },

        getFilteredData(checkedFilterOptions, offsets) {
            return [this.getSlotData(offsets[0])];
        },


        updateDropdown(loadNextPage) {
            if(loadNextPage) {
                // we are loading another page, leave params as they are
            } else {
                this.pageIndex = [];
                this.ajaxQueryNr++;
            }
            let pageIndex = this.pageIndex ? this.pageIndex.slice() : [];
            let ajaxQueryNr = this.ajaxQueryNr || 0;
            return Promise.all(this.getFilteredData(this.checkedFilterOptions, pageIndex)).then(collectedData => {
                if(ajaxQueryNr !== this.ajaxQueryNr) {
                    // another request was triggered, while we were waiting for our response
                    return;
                }

                let result = [];
                let tmpPageIndex = [];
                for(let i = 0; i < collectedData.length; i++) {
                    if(typeof(pageIndex[i]) === 'undefined') {
                        pageIndex[i] = 0;
                    }
                    tmpPageIndex[i] = 0;
                }

                // Merge metadata and users/groups without changing the order of each source (backend might order differently than the browser).
                for(let i = 0; i < this.dataLimit; i++) {
                    let selectedSource = undefined;
                    let selectedItem;
                    for(let source = 0; source < collectedData.length; source++) {
                        let sourceIndex = tmpPageIndex[source];
                        if(collectedData[source].length <= sourceIndex) {
                            continue;
                        }
                        if(selectedSource === undefined) {
                            selectedSource = source;
                            selectedItem = collectedData[source][sourceIndex];
                            continue;
                        }
                        if(collectedData[source][sourceIndex][this.optionLabel].toLocaleLowerCase().localeCompare(selectedItem[this.optionLabel].toLocaleLowerCase()) < 0) {
                            selectedSource = source;
                            selectedItem = collectedData[source][sourceIndex];
                        }
                    }
                    if(selectedSource === undefined) {
                        break;
                    }
                    result.push(selectedItem);
                    pageIndex[selectedSource]++;
                    tmpPageIndex[selectedSource]++;
                }

                if(loadNextPage) {
                    this.options = this.options.concat(result);
                } else {
                    this.options = result;
                }

                this.isLoading = false;
                this.pageIndex = pageIndex;
            });
        },

        /**
     * Select a given option.
     * @param  {Object||String} option
     * @return {void}
     */
        select(option) {
            this._selectOrToggle(option);
        },
        /**
     * Toggle a given option.
     * @param  {Object||String} option
     * @return {void}
     */
        toggle(option) {
            this._selectOrToggle(option, true);
        },
        _selectOrToggle(option, toggle) {
            if(typeof(option) === 'string' && this.taggable) {
                option = {
                    value: option,
                    label: option,
                };
            }
            if (this.isOptionSelected(option)) {
                if(!toggle) {
                    return;
                }
                this.deselect(option);
            } else {
                if (this.multiple) {
                    if (!this.internalValue) {
                        this.internalValue = [option];
                    } else {
                        this.internalValue.push(option);
                        this.$emit('input', this.internalValue);
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
                    if (val === option || typeof val === 'object' && val[this.optionLabel] === option[this.optionLabel]) {
                        ref = val;
                    }
                });
                let index = this.internalValue.indexOf(ref);
                this.internalValue.splice(index, 1);
                this.$emit('input', this.internalValue);
            } else {
                this.internalValue = [];
            }
        },

        /**
     * Disable whole component and prevent user input
     */
        _disable() {
            // Add attribute `disabled` to all inputs
            [...this.$el.querySelectorAll('input')].map( (node) => {
                (this.isDisabled) ? node.setAttribute('disabled', this.isDisabled) : node.removeAttribute('disabled');
            });
            // Add/Remove class `disabled` on all divs
            [...this.$el.querySelectorAll('div')].map( (node) => {
                (this.isDisabled) ? node.classList.add('disabled') : node.classList.remove('disabled');
            });
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
            //ignore toggle if component is disabled
            if( this.isDisabled ) {
                return;
            }

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
                    if (typeof opt === 'object' && opt[this.optionLabel] === option[this.optionLabel]) {
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
                if (typeof opt === 'object' && opt[this.optionLabel] === option) {
                    exists = true;
                } else if (opt === option) {
                    exists = true;
                }
            });

            return exists;
        },
    },
};
</script>

<style lang="scss">
@import '../../../sass/settings.scss';
@import '../../../sass/qwiki/mixins.scss';

.v-select {
    position: relative;
    margin: 0 0 map-get($spacings, medium);

    > .dropdown-menu {
        width: 100%;
    }

    &.ma-failure {
        .fas,.far,.fal {
            color: $ma-failure;
        }
    }
    small.ma-failure {
        color: $ma-failure;
    }

    .input-label {
        @include input-label();
    }

    .dropdown-menu {
        overflow-y: auto;
        position: absolute;
        left: 0;
        z-index: 1000;
        float: left;
        min-width: 160px;
        padding: 0;
        margin: 2px 0 0 0;
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
            margin-top: 0px;
            .list-item {
                border: none;
                padding: 3px 5px;
                cursor: pointer;
                &.highlight,
                &.active {
                    background-color: #eff3f4;
                }
                a {
                    padding-left: 5px;
                     -webkit-box-decoration-break: clone;
                    box-decoration-break: clone;
                }
            }
        }
    }

    .open > .dropdown-menu {
        display: block;
    }

    .open-indicator {
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

    .dropdown-toggle {
        padding: 0;
        white-space: normal;
        width: 100%;
        cursor: text;
        height: auto;

        &.open {
            background-color:transparent;
            border-color: #52cae4;
        }

        &.multi {
            height: auto;
            margin: 0;
            .selected-list {
                margin-left: -4px;
                margin-right: -4px;
            }
        }

        &.disabled {
          cursor: not-allowed;
          background-color: $ma-light-grey;
          color: $ma-disabled-text;
        }

        &.ma-failure {
            border: 1px solid $ma-failure;
        }

    }

    .selected-tag {
        font-size: rem(12px);
        flex: initial;
        float: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &.multi {
            margin: rem(4px);
            &, & a {
                display: inline-block;
            }
        }
        a {
            &, &:hover {
                color: $ma-secondary-text;
            }
        }
        .close-icon {
            margin-left: 3px;
        }
        .button {
            margin: 0px;
        }
    }
    .input-area-small {
        .open-indicator {
            padding: rem(8px) 1em; // 8px = 32 - 2*border - 14px(icon)
        }
        .selected-list {
            margin-top: rem(-1px);
            margin-bottom: rem(-1px);
            padding-top: 0;
            padding-bottom: 0;
        }
        .single-tag[type="text"] {
            padding: 0;
            height: rem(30px);
            line-height: rem(30px);
        }
        .form-control__wrapper {
            min-height: rem(32px);
            line-height: rem(32px);
        }
    }

    .single-tag {
        display: inline-block;
        border: none;
        background-color: transparent;
        &[type="text"] {
            padding: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            height: rem(38px);
            line-height: rem(38px); // 40 - 2*border
        }
    }

    .close-icon {
        cursor: pointer;
    }
    div.close-icon {
        display: inline-block;
    }

    input[type=text] {
        height: rem(38px);
        line-height: rem(38px); // 40 - 2*border
        padding: 0px;
        &, &:focus, &:active {
            border: none;
            background-color: transparent;
        }
    }

    input[type=search],
    input[type=search]:focus {
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

    input[type=search]:disabled {
        cursor: pointer;
    }

    li a {
        cursor: pointer;
    }

    .selected-list {
        height: 100%;
        padding: rem(0px) rem(7px);
    }

    .form-control__wrapper {
        display:block;
        flex: 1 1 auto;
        min-height: rem(32px);
        line-height: rem(32px);
    }
    .multi .form-control__wrapper {
        margin-left: rem(4px);
    }

    .form-control {
        margin-bottom: 0px;
        min-width: 100px;
        width: 100%;
        &:not(.multi) {
            height: rem(38px);
        }
        &.multi {
            height: rem(32px);
        }
    }

    .input-area {
        display: flex;
        flex-flow: row no-wrap;
        width:100%;
        min-height: rem(38px);
    }
    .input-area.input-area-small {
        min-height: rem(30px);
        .form-control__wrapper{
            width: rem(10px);
        }
        input.input-area-small{
            height: rem(32px);
        }
    }

    .multi .input-area:not(.input-area-small) .selected-list {
        margin-top: rem(3px);
        margin-bottom: rem(3px);
    }

    .multi .selected-list {
        flex-wrap: wrap;
        overflow: initial;
    }
    .selected-list {
        display: flex;
        flex-grow: 1;
        height:100%;
        overflow: hidden;
    }

    .infinite-scroll {
        overflow-y: auto;
    }

    .vue-select__dropdown__filter {
        margin: 8px 0px 12px 16px;
    }

    label.vue-select__dropdown__filter__item {
        margin-right: 24px;
    }
    .select-arrow {
        margin-right: 10px;
    }

    .width-xs {
        .select-arrow {
            margin-right: 21px;
        }
        .form-control {
            width: 40px;
            min-width: 40px;
        }
        .dropdown-menu {
            width: 75px;
            min-width: 75px;
        }
        .dropdown-toggle {
            width: 75px;

            .selected-tag {
                min-width: 40px;
            }
        }
    }
    .close-icon-single-tag {
        color: $ma-grey;
        font-size: rem(16px);
        padding-right: rem(8px - $ma-border-width);
        padding-top: rem(11px);
    }
    .input-area-small .close-icon-single-tag {
        padding-top: rem(7px);
    }
}
</style>

