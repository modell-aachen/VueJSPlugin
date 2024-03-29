import VueSelect from './components/vue-select/index.js';
import VueUserSelector from './components/vue-userselector/UserSelector.vue';
import VueSplitbutton from './components/vue-splitbutton/Splitbutton.vue';
import VueDropdown from './components/vue-dropdown/VueDropdown.vue';
import VueButton from './components/vue-button/Button.vue';
import VueCheckItem from './components/vue-check-item/CheckItem.vue';
import VueHistoryList from './components/vue-history-list/HistoryList.vue';
import VueLoaderStore from './components/vue-fullscreen-loader/store/index.js';
import VueInputText from './components/vue-input-text/InputText.vue';
import VueInputRealNumber from './components/vue-input-real-number/InputRealNumber.vue';
import VueInputRealNumberFormWrapper from './components/vue-input-real-number/InputRealNumberFormWrapper.vue';
import VuePagination from './components/vue-pagination/VueSimplePagination.vue';
import VueSpinner from './components/vue-spinner/VueSpinner.vue';
import VueTabpane from './components/vue-tabpane/TabPane.vue';
import VueTab from './components/vue-tabpane/Tab.vue';
import VueInformationTooltip from './components/vue-tooltip/InformationTooltip.vue';
import VueExplanationTooltip from './components/vue-tooltip/ExplanationTooltip.vue';
import VueTextBlock from './components/vue-text-block/VueTextBlock.vue';
import VueDadList from './components/vue-dad-list/DadList.vue';
import VueDadItem from './components/vue-dad-list/DadItem.vue';
import VueCollapsibleDadItem from './components/vue-dad-list/CollapsibleDadItem.vue';
import VueSimpleDadItem from './components/vue-dad-list/SimpleDadItem.vue';
import VueCollapsibleFrame from './components/vue-collapsible-frame/CollapsibleFrame.vue';
import VueWizard from './components/vue-wizard/VueWizard.vue';
import VueSpacer from './components/vue-spacer/Spacer.vue';
import VueHeader from './components/vue-header/VueHeader.vue';
import VueHeader1 from './components/vue-header/VueHeader1.vue';
import VueHeader2 from './components/vue-header/VueHeader2.vue';
import VueHeader3 from './components/vue-header/VueHeader3.vue';
import VuePagedSelector from './components/vue-paged-selector/VuePagedSelector.vue';
import VueMixedInput from './components/vue-mixed-input/MixedInput';
import Sidebar from './components/sidebar/Sidebar.vue';
import SidebarStandardLayout from './components/sidebar/StandardLayout.vue';
import VueAttachments from './components/vue-attachments/Attachments.vue';
import Base64 from 'js-base64';
import { VPopover } from 'v-tooltip';
import i18next from 'i18next';
import VueParams from 'vue-params';
import VueI18Next from 'vue-i18next';
import VeeValidateTranslationDe from 'vee-validate/dist/locale/de';
import VeeValidate, { Validator } from 'vee-validate';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import InfiniteScroll from 'v-infinite-scroll';
import 'v-infinite-scroll/dist/v-infinite-scroll.css';
import * as VueClickOutside from 'v-click-outside-x';
import translationsEn from './translations/en.json';
import translationsDe from './translations/de.json';
import VueUpload from '@websanova/vue-upload';
import 'formdata-polyfill';
import {mapState} from 'vuex';
import isEqual from 'lodash.isequal';
import cloneDeep from 'lodash.clonedeep';
import VueVisible from 'vue-visible';
import VueTable from './components/vue-table/Table.vue';
import {searchGridInit, Grid} from './components/search-grid/index.js';
import SearchGridStandardFields from './components/search-grid/components/StandardFields.js';
import VueClipboard from 'vue-clipboard2';
import VueDatepicker from './components/vue-datepicker/datepicker';
import { module as DocumentStore } from './document-store';
import { module as QwikiStore} from './qwiki-store';

let bufferedMutations;
const getStoreData = (vue) => {
    bufferedMutations = vue.getConfigById('VueJSPluginStoreData');
    Object.keys(bufferedMutations).forEach(name => {
        if(vue.storeExists(vue.Store, name)) {
            bufferedMutations[name].forEach(transaction => vue.Store.commit(transaction.mutation, transaction.payload));
        }
    });
};

class MAVueJsPlugin {
    constructor(options) {
        this.foswiki = options.foswiki;
        this.moment = options.moment;
        this.jquery = options.jquery;
        this.alertPlugin = options.alertPlugin;
        this.debounce = options.debounce;
        this.slideUpDown = options.slideUpDown;
        this.vueTimers = options.vueTimers;
        this.tooltip = options.tooltip;
    }
    install(Vue, options){
        i18next.init({ fallbackLng: 'en' });
        Vue.use(VueParams);
        Vue.use(VueI18Next);
        Vue.use(VueRouter);
        Vue.use(VueResource);
        Vue.use(InfiniteScroll);
        Vue.use(this.vueTimers);
        Vue.use(VueUpload);
        Vue.use(VueClipboard);
        const veeValidateConfig = {
            errorBagName: 'validationErrors',
            fieldsBagName: 'validationFields',
        };
        Vue.use(VeeValidate, veeValidateConfig);
        Vue.use(new this.alertPlugin);
        Vue.use(VueVisible);

        //Component registrations
        Vue.component('vue-attachments', VueAttachments);
        Vue.component('vue-select', VueSelect);
        Vue.component('vue-userselector', VueUserSelector);
        Vue.component('splitbutton', VueSplitbutton);
        Vue.component('vue-dropdown', VueDropdown);
        Vue.component('vue-button', VueButton);
        Vue.component('vue-check-item', VueCheckItem);
        Vue.component('vue-input-text', VueInputText);
        Vue.component('vue-input-real-number', VueInputRealNumber);
        Vue.component('vue-input-real-number-form-wrapper', VueInputRealNumberFormWrapper);
        Vue.component('vue-history-list', VueHistoryList);
        Vue.component('vue-pagination', VuePagination);
        Vue.component('vue-spinner', VueSpinner);
        Vue.component('vue-tabpane', VueTabpane);
        Vue.component('vue-tab', VueTab);
        Vue.component('vue-information-tooltip', VueInformationTooltip);
        Vue.component('vue-explanation-tooltip', VueExplanationTooltip);
        Vue.component('vue-text-block', VueTextBlock);
        Vue.component('vue-dad-list', VueDadList);
        Vue.component('vue-dad-item', VueDadItem);
        Vue.component('vue-collapsible-dad-item', VueCollapsibleDadItem);
        Vue.component('vue-simple-dad-item', VueSimpleDadItem);
        Vue.component('sidebar', Sidebar);
        Vue.component('sidebar-standard-layout', SidebarStandardLayout);
        Vue.component('vue-wizard', VueWizard);
        Vue.component('vue-slide-up-down', this.slideUpDown);
        Vue.component('vue-spacer', VueSpacer);
        Vue.component('vue-header', VueHeader);
        Vue.component('vue-header1', VueHeader1);
        Vue.component('vue-header2', VueHeader2);
        Vue.component('vue-header3', VueHeader3);
        Vue.component('vue-paged-selector', VuePagedSelector);
        Vue.component('vue-collapsible-frame', VueCollapsibleFrame);
        Vue.component('vue-mixed-input', VueMixedInput);
        Vue.component('vue-table', VueTable);
        Vue.component('search-grid', Grid);
        Vue.component('v-popover', VPopover);
        Vue.component('vue-datepicker', VueDatepicker);

        Vue.directive('tooltip', this.tooltip);
        Vue.directive('click-outside', VueClickOutside.directive);

        Vue.directive('scroll', {
            inserted: function (el, binding) {
                let f = function (evt) {
                    if (binding.value(evt, el)) {
                        window.removeEventListener('scroll', f);
                    }
                };
                window.addEventListener('scroll', f);
            },
        });

        //Global functions
        Vue.storeExists = (store, name) => {
            let parts;
            if(!name.split) {
                parts = name.splice();
            } else {
                parts = name.split('/');
            }
            let exists = false;
            let path = store.state;
            while(parts.length) {
                path = path[parts.shift()];
                exists = path;
            }
            return exists;
        };
        Vue.registerStoreModule = (name, module) => {
            if(Vue.storeExists(options.store, name)) {
                options.store.unregisterModule(name);
            }
            options.store.registerModule(name, module);
            let namespace = name.join ? name.join('/') : name;
            if(bufferedMutations && bufferedMutations[namespace]) {
                bufferedMutations[namespace].forEach(transaction => options.store.commit(transaction.mutation, transaction.payload));
            }
        };

        Vue.getConfigById = (id) => {
            let base64Config = this.jquery('script.' + id).html();
            if(!base64Config) {
                return "";
            }
            let config = Base64.Base64.decode(base64Config);
            return JSON.parse(config);
        };

        Vue.registerStoreModule('vueLoaderStore', VueLoaderStore);
        Vue.registerStoreModule(['Qwiki'], QwikiStore);
        Vue.registerStoreModule(['Qwiki', 'Document'], DocumentStore);
        Vue.onDocumentReady = (fn) => {
            this.jquery(fn);
        };

        getStoreData(Vue);

        Vue.instantiateEach = (selector, options) => {
            this.jquery(selector).each((i, element) => {
                let instanceOptions = Object.assign({}, options);
                element.className += " GlossaryConditionalTag";
                instanceOptions.el = element;
                new Vue(instanceOptions);
            });
        };

        Vue.makeAbsoluteUrl = (url) => {
            const absoluteBasePath = Vue.baseUrl();
            if(!url){
                url = "";
            }
            url = url.replace(/^\//,'');
            return `${absoluteBasePath}/${url}`;
        };

        Vue.baseUrl = () => {
            return this.foswiki.getScriptUrl().replace(/\/bin\/$/,'');
        };

        Vue.addTranslation = (language, namespace, translations) => {
            i18next.addResourceBundle(language, namespace, translations);
        };

        Vue.getUniqueId = () => {
            return String.fromCharCode(Math.floor( Math.random() * 24 ) + 65) + Math.random().toString(36).substring(7);
        };

        Vue.isEqual = (value, other) => {
            return isEqual(value, other);
        };

        Vue.cloneDeep = (value) => {
            return cloneDeep(value);
        };

        Vue.debounce = (func, time) => {
            return this.debounce(func, time);
        };

        const $getStrikeOneToken = async function(form) {
            if(!window.StrikeOne) {
                return Promise.resolve(null);
            }
            let $form;
            if(form === undefined) {
                let url = this.$foswiki.getScriptUrl('rest', 'RenderPlugin', 'expand', {
                    text: "<form method='post'></form>",
                });
                let validationKey = await this.$http.get(url).then((response) => {
                    let $remoteForm = jQuery(response.body);
                    return $remoteForm.find('[name="validation_key"]').val();
                });
                if(!validationKey) {
                    return Promise.reject('Could not get validation_key from wiki');
                }
                $form = $(`<form method='post'><input type='hidden' name='validation_key' value='${validationKey}' /></form>`);
                $('body').append($form);
                form = $form.get(0);
            } else {
                $form = $(form);
            }
            window.StrikeOne.submit(form);
            return Promise.resolve($form.find('[name="validation_key"]').val());
        };

        Vue.foswiki = this.foswiki;
        Vue.moment = this.moment;
        Vue.VueRouter = VueRouter;
        Vue.validate = Validator;
        Vue.mapState = mapState;

        //Instance properties/methods
        Vue.prototype.$store = options.store;
        Vue.prototype.$foswiki = this.foswiki;
        Vue.prototype.$moment = this.moment;
        Vue.prototype.$getStrikeOneToken = $getStrikeOneToken;

        let language = this.jquery("html").attr("lang");
        if(!language){
            language = 'en';
        }
        this.moment.locale(language);
        Vue.params.i18nextLanguage = language;
        Vue.prototype.$lang = language;
        Vue.prototype.$ajax = this.jquery.ajax;

        Vue.addTranslation('en', 'VueJSPlugin', translationsEn);
        Vue.addTranslation('de', 'VueJSPlugin', translationsDe);
        Validator.localize('de', {
            messages: VeeValidateTranslationDe.messages,
        });
        Validator.localize(language);

        Vue.SearchGrid = {
            StandardFields: SearchGridStandardFields,
        };

        searchGridInit(Vue);
    }
}

export default MAVueJsPlugin;
