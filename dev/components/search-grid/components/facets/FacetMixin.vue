<script>
import GridComponentMixin from "../GridComponentMixin.vue";
import * as mutations from "../../store/mutation-types";
export default {
    mixins: [GridComponentMixin],
    i18nextNamespace: "SearchGrid",
    props: {
        params: {
            type: Array,
            default: () => [],
        },
        facetValues: {
            type: Object,
            default: () => {},
        },
        facetTotalCounts: {
            type: Object,
            default: () => {},
        },
    },
    data: function(){
        return {
            selectedFacet: [],
            selectedFacetUnwatch: null,
        };
    },
    computed: {
        id(){
            return Math.random().toString(36).substring(7);
        },
        title: function(){
            return this.params[0];
        },
        field: function(){
            return this.params[1];
        },
        limit: function(){
            if(this.params.length >= 3){
                return this.params[2];
            } else {
                return -1;
            }
        },
        // Used as facet.field in solr queries.
        facetField: function(){
            return `{!ex=${this.field}}${this.field}`;
        },
        totalCount: function(){
            return this.facetTotalCounts[this.field];
        },
        filterQuery: function(){
            let field = `{!tag=${this.field} q.op=OR}${this.field}`;
            let queryString = "";
            if(this.selectedFacet.length > 0){
                for(let i=0; i < this.selectedFacet.length; i++){
                    queryString += this.escapeSolrQuery((this.selectedFacet[i].field)?this.selectedFacet[i].field:this.selectedFacet[i].value);
                    if(i !== this.selectedFacet.length - 1) {
                        queryString += " ";
                    }
                }

                //'__none__ ' is used for empty fields
                if(queryString === '__none__'){
                    queryString = `(-${this.field}:["" TO *])`;
                }else{
                    queryString = "(" + queryString + ")";
                }

            } else {
                return null;
            }
            return `${field}:${queryString}`;
        },
        facetCharacteristics: function(){
            return this.facetValues[this.field];
        },
    },
    mounted: function () {
        this.$store.commit("searchGrid/" + mutations.REGISTER_FACET, {gridState: this.gridState, facet: this});
        this.selectedFacetUnwatch = this.$watch("selectedFacet", function () {
            this.$parent.facetChanged();
        });
    },
    methods: {
        getLabel: function(value, count){
            return value + " (" + count + ")";
        },
        escapeSolrQuery: function(string){
            return string.replace(/\+|-|:|\(|\)|\|\||&&|!|"|\s/g, function(finding){
                return `\\${finding}`;
            });
        },
        reset: function(){
            this.selectedFacet = [];
        },
        convertQueryToSearchTerms: function(query){
            let wordBreakChars = [
                '\'', '"', ':', ',' , ';', '&',
                '>', '<', '!', '§', '%', '/',
                '`', '=', '~', '#', '@',
                // Escaped characters according to mordern regex flavor (PCRE)
                '\\^', '\\$', '\\*', '\\+', '\\-', '\\_', '\\?',
                '\\(', '\\)', '\\[', '\\]', '\\{', '\\}', '\\', '\\|',
            ];
            //Special case included: split only on "FULL STOP" dots, i.e. at least on whitespace afterwards
            let wordBreakCharsRegExp = new RegExp('[' + wordBreakChars.join('') + ']|\\.\\s{1,}|\\s');
            let terms = query
                .split(wordBreakCharsRegExp)
                .filter((w) => {
                    return w !== "";
                });
            return terms;
        },
    },
};
</script>

<style lang="scss">
.facet {
    .facet-list {
        margin-top: 8px;
        list-style: none !important;
        padding: 0px;
        li {
            margin-bottom: 5px;
        }
    }
}
</style>
