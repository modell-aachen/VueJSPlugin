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
        },
    };

    window.SearchGridPlugin = SearchGridPlugin;

    vue.onDocumentReady( function () {
        Vue.addTranslation('en', 'SearchGrid', translationsEn);
        Vue.addTranslation('de', 'SearchGrid', translationsDe);

        jQuery('div.SearchGridContainer').each(function() {
            let $this = jQuery(this);
            let selector = $this.find('.prefsSelector').text();
            let grid = jQuery('<vue-grid></vue-grid>');
            grid.attr('preferences-selector', selector);
            $this.append(grid);
        });
        vue.instantiateEach('.SearchGridContainer', {
            components: {
                vueGrid: Grid,
            },
            created: function () {
                this.$moment.locale(this.$lang);
            },
        });
    });
};

export {searchGridInit, Grid};

