import VueSelect from './components/vue-select/index.js';
import VueUserSelector from './components/vue-userselector/UserSelector.vue';
import VueSplitbutton from './components/vue-splitbutton/Splitbutton.vue';
import VuePagination from './components/vue-pagination/VueSimplePagination.vue';
import VueSpinner from './components/vue-spinner/VueSpinner.vue';
import VueTabpane from './components/vue-tabpane/TabPane.vue';
import VueTab from './components/vue-tabpane/Tab.vue';
import Sidebar from './components/sidebar/Sidebar.vue';
import SidebarStandardLayout from './components/sidebar/StandardLayout.vue';
import VueWizard from './components/vue-wizard/VueWizard.vue';
import Base64 from 'js-base64';
import { VTooltip } from 'v-tooltip';
import i18next from 'i18next';
import VueParams from 'vue-params';
import VueI18Next from 'vue-i18next';
import VeeValidate from 'vee-validate';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import InfiniteScroll from 'v-infinite-scroll';
import 'v-infinite-scroll/dist/v-infinite-scroll.css';

class MAVueJsPlugin {
  constructor(options) {
    this.foswiki = options.foswiki;
    this.moment = options.moment;
    this.jquery = options.jquery;
  }
  install(Vue, options){
    i18next.init();
    Vue.use(VueParams);
    Vue.use(VueI18Next);
    Vue.use(VueRouter);
    Vue.use(VueResource);
    Vue.use(InfiniteScroll);
    const veeValidateConfig = {
      errorBagName: 'validationErrors',
      fieldsBagName: 'validationFields'
    };
    Vue.use(VeeValidate, veeValidateConfig);

    //Component registrations
    Vue.component('vue-select', VueSelect);
    Vue.component('vue-userselector', VueUserSelector);
    Vue.component('vue-splitbutton', VueSplitbutton);
    Vue.component('vue-pagination', VuePagination);
    Vue.component('vue-spinner', VueSpinner);
    Vue.component('vue-tabpane', VueTabpane);
    Vue.component('vue-tab', VueTab);
    Vue.component('sidebar', Sidebar);
    Vue.component('sidebar-standard-layout', SidebarStandardLayout);
    Vue.component('vue-wizard', VueWizard);
    Vue.directive('tooltip', VTooltip);

    //Global functions
    Vue.registerStoreModule = (name, module) => {
      options.store.registerModule(name, module);
    };

    Vue.onDocumentReady = (fn) => {
      this.jquery(fn);
    };

    Vue.instantiateEach = (selector, options) => {
      this.jquery(selector).each((i, element) => {
        let instanceOptions = Object.assign({}, options);
        instanceOptions.el = element;
        new Vue(instanceOptions);
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

    Vue.foswiki = this.foswiki;
    Vue.moment = this.moment;
    Vue.VueRouter = VueRouter;

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
  }
}

export default MAVueJsPlugin;
