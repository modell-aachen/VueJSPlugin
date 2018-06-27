/* global $ foswiki moment */
import VueSelect from './components/vue-select/index.js'
import VuePagination from './components/vue-pagination/VueSimplePagination.vue'
import Base64 from 'js-base64'
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
