/* global $ foswiki moment */
import VueSelect from './components/vue-select/index.js'
import VuePagination from './components/vue-pagination/VueSimplePagination.vue'
import Sidebar from './components/sidebar/Sidebar.vue'
import SidebarStandardLayout from './components/sidebar/StandardLayout.vue'
import VueWizard from './components/vue-wizard/VueWizard.vue'
import Base64 from 'js-base64'
import { VTooltip } from 'v-tooltip'

let MAVueJsPlugin = {
	install(Vue, options){
		//Component registrations
		Vue.component('vue-select', VueSelect);
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
		}

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

		Vue.foswiki = foswiki;
		Vue.moment = moment;

		//Instance properties/methods
		Vue.prototype.$store = options.store;
		Vue.prototype.$foswiki = foswiki;
		Vue.prototype.$moment = moment;
		Vue.prototype.$lang = $("html").attr("lang");
		Vue.prototype.$ajax = $.ajax;
	},
	htmlDecode(input){
		var e = $("<div></div>");
		e.html(input);
		return e.text();
	}
}

export default MAVueJsPlugin;
