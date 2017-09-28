/* global $ foswiki moment */
import VueSelect from './components/vue-select/index.js'
import VuePagination from './components/vue-pagination/VueSimplePagination.vue'
import { VTooltip } from 'v-tooltip'

let MAVueJsPlugin = {
	install(Vue, options){
		//Component registrations
		Vue.component('vue-select', VueSelect);
		Vue.component('vue-pagination', VuePagination);

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
			var config = $('.' + id).html();
			return JSON.parse(this.htmlDecode(config));
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
		var e = document.createElement('div');
		e.innerHTML = input;
		return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
	}
}

export default MAVueJsPlugin;
