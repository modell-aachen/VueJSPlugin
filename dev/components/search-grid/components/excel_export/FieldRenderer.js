/*
    Renders fields into the format used in exported excel sheets.

    To extend the renderer just add a new class method with the same name as the grid
    field it should render.
*/

import UrlFormatField from '../fields/UrlFormatField.vue';

class FieldRenderer {
    ["text-field"](solrDocument, fieldParameters) {
        return solrDocument[fieldParameters[0]];
    }

    ["url-field"](solrDocument, fieldParameters) {
        let text = solrDocument[fieldParameters[0]];
        let url = solrDocument[fieldParameters[1]];
        url = Vue.makeAbsoluteUrl(url);
        return `${text} (${url})`;
    }

    ["url-format-field"](solrDocument, fieldParameters) {
        let text = fieldParameters[0];
        let url = fieldParameters[1];
        url = UrlFormatField.methods.formatLink(url, solrDocument);
        url = Vue.makeAbsoluteUrl(url);
        return `${text} (${url})`;
    }

    ["date-field"](solrDocument, fieldParameters) {
        let date = solrDocument[fieldParameters[0]];
        if(!date || Vue.moment(date).unix() === 0){
            return "";
        }
        return Vue.moment(date, Vue.moment.ISO_8601).toDate().toLocaleDateString();
    }

    ["list-field"](solrDocument, fieldParameters) {
        let list = solrDocument[fieldParameters[0]];
        if(!list){
            return "";
        }
        return solrDocument[fieldParameters[0]].join(',');
    }

    ["user-field"](solrDocument, fieldParamters) {
        let displayFieldName = fieldParamters[0];
        let displayName = solrDocument[displayFieldName];
        if(displayName === undefined || displayName === null) {
            displayName = '';
        }
        return displayName;
    }

    renderFieldForDocument(solrDocument, field) {
        return this[field.component](solrDocument, field.params);
    }

    supportsFieldRendering(fieldName) {
        return (typeof this[fieldName] === 'function');
    }
}

let fieldRenderer = new FieldRenderer();
export default fieldRenderer;
