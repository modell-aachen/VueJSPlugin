<template>
    <div class="search-grid-top-filter">
        <label
            :for="id"
            class="input-label">{{ params[0] }}</label>
        <vue-select
            v-model="selectedOption"
            :prevent-search-filter="true"
            :initial-options="getOptions"
            is-small />
    </div>
</template>

<script>
import FacetMixin from '../facets/FacetMixin.vue';
export default {
    i18nextNamespace: "SearchGrid",
    mixins: [FacetMixin],
    data:  function () {
        return {
            selectedOption: this.params.length > 2 ? [this.params[2]] : [],
            isFilter: true,
        };
    },
    computed: {
        totalCount: function(){
            return "";
        },
        isDefault: function(){
            return this.selectedOption === [];
        },
        limit: function(){
            return -1;
        },
        getOptions: function(){
            let options = [];
            let noneOpt = {};
            noneOpt.value ="";
            noneOpt.label = this.$t('all');
            options.push(noneOpt);
            for(let facetValue of this.facetValues[this.params[1]]){
                facetValue.value = [facetValue.field];
                facetValue.label = `${facetValue.title} (${facetValue.count})`;
                options.push(facetValue);
            }
            return options;
        },
    },
    watch: {
        selectedOption() {
            this.watchSelectedOption();
        },
    },
    mounted: function(){
        this.selectedFacetUnwatch();
        this.watchSelectedOption();
    },
    methods: {
        watchSelectedOption() {
            this.selectedFacet = [];
            this.selectedOption.forEach(selectedOption => {
                if(this.selectedFacet.length === 0) {
                    for(let i = 0; i < this.facetCharacteristics.length; i++){
                        let currentCharacteristic = this.facetCharacteristics[i];
                        if(currentCharacteristic.field === selectedOption.field){
                            this.selectedFacet.push(currentCharacteristic);
                            break;
                        }
                    }
                }
            });
            this.$emit("filter-change");
        },
        reset() {
            this.selectedOption = [];
        },
    },
};
</script>

<style lang="scss">
@import '../../../../sass/settings.scss';
@import '../../../../sass/qwiki/mixins.scss';
    .search-grid-top-filter {
        .input-label {
            @include input-label();
        }
    }
</style>
