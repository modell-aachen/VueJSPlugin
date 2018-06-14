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
import VueTextBlock from './components/vue-text-block/VueTextBlock.vue';
import VueDadList from './components/vue-dad-list/DadList.vue';
import VueDadItem from './components/vue-dad-list/DadItem.vue';
import VueCollapsibleDadItem from './components/vue-dad-list/CollapsibleDadItem.vue';
import VueSimpleDadItem from './components/vue-dad-list/SimpleDadItem.vue';
import VueWizard from './components/vue-wizard/VueWizard.vue';
import VueSpacer from './components/vue-spacer/Spacer.vue';
import VueHeader from './components/vue-header/VueHeader.vue';
import VueHeader1 from './components/vue-header/VueHeader1.vue';
import VueHeader2 from './components/vue-header/VueHeader2.vue';
import VueHeader3 from './components/vue-header/VueHeader3.vue';
import VuePagedSelector from './components/vue-paged-selector/VuePagedSelector.vue';
import Sidebar from './components/sidebar/Sidebar.vue';
import SidebarStandardLayout from './components/sidebar/StandardLayout.vue';
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
import VueSlideUpDown from 'vue-slide-up-down';
import {mapState} from 'vuex';

class MAVueJsPlugin {
    constructor(options) {
        this.foswiki = options.foswiki;
        this.moment = options.moment;
        this.jquery = options.jquery;
        this.alertPlugin = options.alertPlugin;
    }
    install(Vue, options){
        i18next.init();
        Vue.use(VueParams);
        Vue.use(VueI18Next);
        Vue.use(VueRouter);
        Vue.use(VueResource);
        Vue.use(InfiniteScroll);
        Vue.use(Vddl);
        const veeValidateConfig = {
            errorBagName: 'validationErrors',
            fieldsBagName: 'validationFields'
        };
        Vue.use(VeeValidate, veeValidateConfig);
        Vue.use(new this.alertPlugin);

        //Component registrations
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
        Vue.component('vue-text-block', VueTextBlock);
        Vue.component('vue-dad-list', VueDadList);
        Vue.component('vue-dad-item', VueDadItem);
        Vue.component('vue-collapsible-dad-item', VueCollapsibleDadItem);
        Vue.component('vue-simple-dad-item', VueSimpleDadItem);
        Vue.component('sidebar', Sidebar);
        Vue.component('sidebar-standard-layout', SidebarStandardLayout);
        Vue.component('vue-wizard', VueWizard);
        Vue.component('vue-slide-up-down', VueSlideUpDown);
        Vue.component('vue-spacer', VueSpacer);
        Vue.component('vue-header', VueHeader);
        Vue.component('vue-header1', VueHeader1);
        Vue.component('vue-header2', VueHeader2);
        Vue.component('vue-header3', VueHeader3);
        Vue.component('vue-paged-selector', VuePagedSelector);
        Vue.directive('tooltip', VTooltip);
        Vue.directive('click-outside', VueClickOutside);

        //Global functions
        Vue.registerStoreModule = (name, module) => {
            options.store.registerModule(name, module);
        };

        Vue.onDocumentReady = (fn) => {
            this.jquery(fn);
        };

        Vue.instantiateEach = (selector, options) => {
            this.jquery(selector).each((i, element) => {
                //check if client registered herself through by the VueJSPlugin
                let vueClientId = this.jquery(element).attr('data-vue-client-id');
                let vueClientToken = this.jquery(element).attr('data-vue-client-token');
                let tokenElement = this.jquery('[data-vue-client-id="' + vueClientId + '"]');
                let valid = false;
                if( tokenElement.length ) {
                    let tokenDef = JSON.parse(tokenElement.html());
                    if( vueClientToken === tokenDef.token ) {
                        valid = true;
                        // received valid token
                        let instanceOptions = Object.assign({}, options);
                        instanceOptions.el = element;
                        new Vue(instanceOptions);
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
            return Math.random().toString(36).substring(7);
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
