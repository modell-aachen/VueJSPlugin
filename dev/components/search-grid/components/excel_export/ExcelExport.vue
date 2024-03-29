<template>
    <div>
        <a
            v-show="!loading"
            :title="tooltip"
            class="excel"
            @click="exportToExcel()">
            <img :src="iconImage">
        </a>
        <i
            v-show="loading"
            class="fa fa-circle-o-notch fa-spin fa-3x fa-fw" />
    </div>
</template>

<script>
import FieldRenderer from "./FieldRenderer.js";

const SOLR_ROWS_LIMIT = 2 ** 31 - 1;

export default {
    i18nextNamespace: "SearchGrid",
    props: {
        fields: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            loading: false,
        };
    },
    computed: {
        iconImage() {
            return `${this.$foswiki.getPubUrl()}/System/SearchGridPlugin/excel_logo.png`;
        },
        tooltip() {
            return this.$t("export_elements");
        },
        fieldsToExport() {
            return  this.fields.filter((field) => {
                return FieldRenderer.supportsFieldRendering(field.component);
            });
        },
    },
    methods: {
        getEntriesToExport() {
            return new Promise((resolve, reject) => {
                let params = this.$parent.getSearchQueryRequestParameters();
                params.rows = SOLR_ROWS_LIMIT;
                params.start = 0;

                this.$ajax({
                    type: "POST",
                    headers: { 'X-HTTP-Method-Override': 'GET' },
                    url: this.$foswiki.getScriptUrl('rest', 'SearchGridPlugin', 'searchproxy'),
                    traditional: true,
                    data: params,
                    dataType: 'json',
                })
                    .done((result) => {
                        return resolve(result.response.docs);
                    })
                    .fail((reason) => {
                        return reject(reason);
                    });
            });
        },
        convertDocumentsToExcelExportPluginFormat(solrDocuments) {
            //The format we need to achieve:
            //[["Header1", "Header2",...],[Row1Value1,Row1Value2,...],...]

            let renderedHeaders = this.fieldsToExport.map((field) =>{
                return field.title;
            });

            let renderedDocuments = [];
            for(let solrDocument of solrDocuments){
                let renderedDocument = [];
                for(let field of this.fieldsToExport){
                    renderedDocument.push(FieldRenderer.renderFieldForDocument(solrDocument, field));
                }
                renderedDocuments.push(renderedDocument);
            }

            return [renderedHeaders].concat(renderedDocuments);
        },
        createExcelFile(data) {
            return new Promise((resolve, reject) => {
                let exportRequestData = {
                    web: this.$foswiki.preferences.WEB,
                    topic: this.$foswiki.preferences.TOPIC,
                    header: this.fieldsToExport.length,
                    data: data,
                };

                return this.$ajax({
                    type: "POST",
                    url: this.$foswiki.getScriptUrl('restauth', 'ExportExcelPlugin', 'export'),
                    traditional: true,
                    data: {payload: JSON.stringify(exportRequestData)},
                })
                    .done((downloadUrl) => {
                        resolve(downloadUrl);
                    })
                    .fail((reason) => {
                        reject(reason);
                    });
            });
        },
        exportToExcel() {
            this.loading = true;
            this.getEntriesToExport()
                .then((results) => {
                    let data = this.convertDocumentsToExcelExportPluginFormat(results);
                    return this.createExcelFile(data);
                })
                .then((downloadUrl) => {
                    this.downloadExcelFile(downloadUrl);
                    this.loading = false;
                })
                .catch((reason) => {
                    this.loading = false;
                    alert(`Excel export failed: ${reason}`);
                });
        },
        downloadExcelFile(downloadUrl) {
            window.location.href = downloadUrl;
        },
    },
};
</script>

<style lang="scss">
.excel {
    cursor: pointer;
    img {
        height: 32px;
        margin-bottom:16px;
    }
}
</style>
