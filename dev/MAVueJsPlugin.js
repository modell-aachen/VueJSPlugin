/* global $ foswiki moment */
import VueSelect from './components/vue-select/index.js'
import VuePagination from './components/vue-pagination/VueSimplePagination.vue'


let MAVueJsPlugin = {
	install(Vue, options){
		//Component registrations
		Vue.component('vue-select', VueSelect);
		Vue.component('vue-pagination', VuePagination);

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
			return JSON.parse($('.' + id).html());
		};

		//Instance properties/methods
		Vue.prototype.$store = options.store;
		Vue.prototype.$foswiki = foswiki;
		Vue.prototype.$moment = moment;
		Vue.prototype.$lang = $("html").attr("lang");
		Vue.prototype.$ajax = $.ajax;
	}
}

export default MAVueJsPlugin;