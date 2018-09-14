import VueSelect from './components/vue-select/index.js';
import VueUserSelector from './components/vue-userselector/UserSelector.vue';
import VueSplitbutton from './components/vue-splitbutton/Splitbutton.vue';
import VueButton from './components/vue-button/Button.vue';
import VueCheckItem from './components/vue-check-item/CheckItem.vue';
import VueInputText from './components/vue-input-text/InputText.vue';
import VuePagination from './components/vue-pagination/VueSimplePagination.vue';
import VueSpinner from './components/vue-spinner/VueSpinner.vue';
import VueTabpane from './components/vue-tabpane/TabPane.vue';
import VueTab from './components/vue-tabpane/Tab.vue';
import VueTooltip from './components/vue-tooltip/Tooltip.vue';
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
import { VTooltip } from 'v-tooltip';
import i18next from 'i18next';
import Vddl from 'vddl';
import VueParams from 'vue-params';
import VueI18Next from 'vue-i18next';
import VeeValidateTranslationDe from 'vee-validate/dist/locale/de';
import VeeValidate, { Validator } from 'vee-validate';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import InfiniteScroll from 'v-infinite-scroll';
import 'v-infinite-scroll/dist/v-infinite-scroll.css';
import VueClickOutside from 'vue-click-outside';
import translationsEn from './translations/en.json';
import translationsDe from './translations/de.json';
import VueUpload from '@websanova/vue-upload';
import 'formdata-polyfill';
import {mapState} from 'vuex';
import isEqual from 'lodash.isequal';
import cloneDeep from 'lodash.clonedeep';
import VueVisible from 'vue-visible';

class MAVueJsPlugin {
    constructor(options) {
        this.foswiki = options.foswiki;
        this.moment = options.moment;
        this.jquery = options.jquery;
        this.alertPlugin = options.alertPlugin;
        this.debounce = options.debounce;
        this.slideUpDown = options.slideUpDown;
    }
    install(Vue, options){
        i18next.init();
        Vue.use(VueParams);
        Vue.use(VueI18Next);
        Vue.use(VueRouter);
        Vue.use(VueResource);
        Vue.use(InfiniteScroll);
        Vue.use(VueUpload);
        Vue.use(Vddl);
        const veeValidateConfig = {
            errorBagName: 'validationErrors',
            fieldsBagName: 'validationFields'
        };
        Vue.use(VeeValidate, veeValidateConfig);
        Vue.use(new this.alertPlugin);
        Vue.use(VueVisible);

        //Component registrations
        Vue.component('vue-attachments', VueAttachments);
        Vue.component('vue-select', VueSelect);
        Vue.component('vue-userselector', VueUserSelector);
        Vue.component('splitbutton', VueSplitbutton);
        Vue.component('vue-button', VueButton);
        Vue.component('vue-check-item', VueCheckItem);
        Vue.component('vue-input-text', VueInputText);
        Vue.component('vue-pagination', VuePagination);
        Vue.component('vue-spinner', VueSpinner);
        Vue.component('vue-tabpane', VueTabpane);
        Vue.component('vue-tab', VueTab);
        Vue.component('vue-tooltip', VueTooltip);
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
        Vue.directive('tooltip', VTooltip);
        Vue.directive('click-outside', VueClickOutside);

        //Global functions
        Vue.registerStoreModule = (name, module) => {
            if(options.store.state[name]) {
                options.store.unregisterModule(name);
            }
            options.store.registerModule(name, module);
        };

        Vue.onDocumentReady = (fn) => {
            this.jquery(fn);
        };

        Vue.instantiateEach = (selector, options) => {
            this.jquery(selector).each((i, element) => {

                let vueClientToken = this.jquery(element).attr('data-vue-client-token');
                let valid = !!vueClientToken;

                if( valid ) {
                    let tokenElements = this.jquery('head > script.vue-client-registrations');

                    if( tokenElements.length ) {
                        let tokens = [];
                        tokenElements.each( (i,e) => {
                            let tokenDef = JSON.parse( this.jquery(e).html());
                            tokens.push( tokenDef.token );
                        });

                        valid = tokens.filter( t =>  {
                            return t === vueClientToken;
                        }).length === 1;

                        if( valid ) {
                            let instanceOptions = Object.assign({}, options);
                            instanceOptions.el = element;
                            new Vue(instanceOptions);
                        }
                    }else{
                        valid = false;
                    }
                }

                if( !valid ) {
                    console.warn("Prevented Vue instantiation for " + selector + " due to missing or invalid token.\nEach usage of Vue needs to be registered beforehand." ); // eslint-disable-line no-console
                }
            });
        };

        Vue.getConfigById = (id) => {
            let base64Config = this.jquery('.' + id).html();
            let config = Base64.Base64.decode(base64Config);
            return JSON.parse(config);
        };

        Vue.makeAbsoluteUrl = (url) => {
            const absoluteBasePath = this.foswiki.getScriptUrl().replace(/bin\/$/,'');
            if(!url){
                url = "";
            }
            url = url.replace(/^\//,'');
            return `${absoluteBasePath}${url}`;
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
        Vue.params.i18nextLanguage = language;
        Vue.prototype.$lang = language;
        Vue.prototype.$ajax = this.jquery.ajax;

        Vue.addTranslation('en', 'VueJSPlugin', translationsEn);
        Vue.addTranslation('de', 'VueJSPlugin', translationsDe);
        Validator.localize('de', {
            messages: VeeValidateTranslationDe.messages
        });
        Validator.localize(language);
    }
}

export default MAVueJsPlugin;
