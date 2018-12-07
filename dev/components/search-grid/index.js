import SearchGridStoreModule from "./store/index.js";
import Grid from './components/Grid.vue';
import translationsEn from './translations/en.json';
import translationsDe from './translations/de.json';

const searchGridInit = (vue) => {
    vue.registerStoreModule("searchGrid", SearchGridStoreModule);
    let SearchGridPlugin = {
        registerField: function(name, component){
            vue.component(name, component);
        },
        registerComponent: function(name, component){
            vue.component(name, component);
        }
    };

    window.SearchGridPlugin = SearchGridPlugin;

    vue.onDocumentReady( function () {
        Vue.addTranslation('en', 'SearchGrid', translationsEn);
        Vue.addTranslation('de', 'SearchGrid', translationsDe);

        vue.instantiateEach('.SearchGridContainer', {
            components: {
                grid: Grid
            },
            created: function () {
                this.$moment.locale(this.$lang);
            }
        });
    });
};

export {searchGridInit, Grid};

