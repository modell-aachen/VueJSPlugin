<template>
    <div class="search-grid-top-filter">
        <label :for="id">{{ params[0] }}</label>
        <vue-select
            :prevent-search-filter="true"
            :options="getOptions"
            v-model="selectedOption"
            is-small/>
    </div>
</template>

<script>
import MaketextMixin from '../MaketextMixin.vue';
import FacetMixin from '../facets/FacetMixin.vue';
export default {
    mixins: [MaketextMixin,FacetMixin],
    data:  function () {
        return {
            selectedOption: this.params.length > 2 ? [this.params[2]] : [],
            isFilter: true
        };
    },
    computed: {
        totalCount: function(){
            return "";
        },
        isDefault: function(){
            return this.selectedOption === '';
        },
        limit: function(){
            return -1;
        },
        getOptions: function(){
            let options = [];
            let noneOpt = {};
            noneOpt.value ="";
            noneOpt.label = this.maketext('All');
            options.push(noneOpt);
            for(let facetValue of this.facetValues[this.params[1]]){
                facetValue.value = [facetValue.field];
                facetValue.label = `${facetValue.title} (${facetValue.count})`;
                options.push(facetValue);
            }
            return options;
        }
    },
    watch: {
        selectedOption() {
            this.watchSelectedOption();
        }
    },
    mounted: function(){
        this.selectedFacetUnwatch();
        this.watchSelectedOption();
    },
    methods: {
        watchSelectedOption() {
            this.selectedFacet = [];
            if(this.selectedOption === '') {
                return;
            }
            for(let i = 0; i < this.facetCharacteristics.length; i++){
                let currentCharacteristic = this.facetCharacteristics[i];
                if(currentCharacteristic.field === this.selectedOption){
                    this.selectedFacet.push(currentCharacteristic);
                    break;
                }
            }
            this.$emit("filter-change");
        },
        reset() {
            this.selectedOption = "";
        }
    },
};
</script>
