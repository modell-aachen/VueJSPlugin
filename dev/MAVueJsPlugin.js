/* global $ foswiki moment */
import VueSelect from './components/vue-select/index.js';
import VueSplitbutton from './components/vue-splitbutton/Splitbutton.vue';
import VuePagination from './components/vue-pagination/VueSimplePagination.vue';
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

let MAVueJsPlugin = {
  install(Vue, options){
    i18next.init();
    Vue.use(VueParams);
    Vue.use(VueI18Next);
    Vue.use(VueRouter);
    const veeValidateConfig = {
      errorBagName: 'validationErrors',
      fieldsBagName: 'validationFields'
    };
    Vue.use(VeeValidate, veeValidateConfig);

    //Component registrations
    Vue.component('vue-select', VueSelect);
    Vue.component('vue-splitbutton', VueSplitbutton);
    Vue.component('vue-pagination', VuePagination);
    Vue.component('sidebar', Sidebar);
    Vue.component('sidebar-standard-layout', SidebarStandardLayout);
    Vue.component('vue-wizard', VueWizard);
    Vue.directive('tooltip', VTooltip);

    //Global functions
    Vue.registerStoreModule = (name, module) => {
      options.store.registerModule(name, module);
    };

    Vue.onDocumentReady = (fn) => {
      $(fn);
    };

    Vue.instantiateEach = (selector, options) => {
      $(selector).each((i, element) => {
        let instanceOptions = Object.assign({}, options);
        instanceOptions.el = element;
        new Vue(instanceOptions);
      });
    };

    Vue.getConfigById = (id) => {
      let base64Config = $('.' + id).html();
      let config = Base64.Base64.decode(base64Config);
      return JSON.parse(config);
    };

    Vue.makeAbsoluteUrl = (url) => {
      const absoluteBasePath = foswiki.getScriptUrl().replace(/bin\/$/,'');
      if(!url){
        url = "";
      }
      url = url.replace(/^\//,'');
      return `${absoluteBasePath}${url}`;
    };

    Vue.addTranslation = (language, namespace, translations) => {
      i18next.addResourceBundle(language, namespace, translations);
    };

    Vue.foswiki = foswiki;
    Vue.moment = moment;
    Vue.VueRouter = VueRouter;

    //Instance properties/methods
    Vue.prototype.$store = options.store;
    Vue.prototype.$foswiki = foswiki;
    Vue.prototype.$moment = moment;

    const language = $("html").attr("lang");
    Vue.params.i18nextLanguage = language;
    Vue.prototype.$lang = language;
    Vue.prototype.$ajax = $.ajax;
  },
  htmlDecode(input){
    let e = $("<div></div>");
    e.html(input);
    return e.text();
  }
};

export default MAVueJsPlugin;
