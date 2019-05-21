<template>
    <div>
        <div class="solrSearchHit solrTopicHit clearfix">
            <h3 title="topic">
                <img
                    :src="doc['icon']"
                    class="solrHitIcon"
                    height="16"
                    width="16">
                <a :href="doc['url']">{{ doc["title"] }}</a>
                <span class="foswikiGrayText foswikiSmallish solrContainerLink"> {{ sIn }} <a :href="doc['container_url']">{{ doc["web"] }}</a>
                    <em
                        v-if="doc['workflow_controlled_b']"
                        style="font-size: 0.9em;"
                        title="not approved">({{ doc['workflowmeta_name_s_dv'] }})</em>
                    <img
                        :src="'/pub/System/FamFamFamFlagIcons/' + fieldLanguage + '.png'"
                        :title="fieldLanguage"
                        class="modacFlag"></span>
            </h3>
            <div class="solrHilite">
                {{ doc["text"] }}
            </div>
            <div class="solrRevisoin">
                {{ date }}, {{ doc["author_s"] }}
            </div>
        </div>
    </div>
</template>

<script>
import FieldMixin from "./FieldMixin.vue";

export default {
    mixins: [FieldMixin],
    data: function () {
        return {
            sIn: this.$foswiki.jsi18n.get('SearchGrid', 'in'),
        };
    },
    computed: {
        fieldLanguage: function() {
            if (this.doc['language'] === 'en'){
                return 'gb';
            } else {
                return this.doc['language'];
            }
        },
        date: function(){
            return this.$moment(this.doc['date']);
        },
    },
};
</script>
