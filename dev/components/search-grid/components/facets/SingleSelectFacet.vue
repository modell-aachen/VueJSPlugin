<template>
    <div class="facet">
        <label class="input-label">{{ title }}</label>
        <ul class="facet-list">
            <li>
                <vue-check-item
                    v-model="selectedRadio"
                    type="radio"
                    checked>{{ $t("all") }}</vue-check-item>
            </li>
            <template v-for="(value,index) in facetCharacteristics">
                <li
                    v-show="value.count > 0 || isSelected(value)"
                    :key="index">
                    <vue-check-item
                        :value="value.field"
                        v-model="selectedRadio"
                        type="radio">{{ getLabel(value.title, value.count) }}</vue-check-item>
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
import FacetMixin from './FacetMixin.vue';
export default {
    mixins: [FacetMixin],
    data: function(){
        return {
            selectedRadio: this.params.length > 3 ? this.params[3] : ''
        };
    },
    watch: {
        selectedRadio(){
            this.updateSelectedFacets();
        }
    },
    created: function () {
        this.updateSelectedFacets();
    },
    methods: {
        isSelected(value){
            if(this.selectedFacet.length === 0) {
                return false;
            }
            return value.field === this.selectedFacet[0].field;
        },
        getRadioId: function(field){
            return `${this.id}-${field}`;
        },
        updateSelectedFacets() {
            this.selectedFacet = [];
            if(this.selectedRadio === '') {
                return;
            }
            for(let i = 0; i < this.facetCharacteristics.length; i++){
                let currentCharacteristic = this.facetCharacteristics[i];
                if(currentCharacteristic.field === this.selectedRadio){
                    this.selectedFacet.push(currentCharacteristic);
                    break;
                }
            }
        },
        reset() {
            this.selectedRadio = "";
        }
    },
};
</script>
