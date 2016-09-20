// Filter to turn "ma-css-color-name" into "Css Color Name"
Vue.filter('colorName', function(cssName) {
    return cssName.replace(/^ma/, "").replace(/-([a-z])/g, function (match, p1) {
        return " "+p1.toUpperCase();
    });
});

// Component displaying the color name and a color picker to change the value
var SetColorComponent = Vue.extend({
    props: ['color'],
    data: function () {
        return {
            invalidHex: false,
            justChanged: false,
            textValue: "#000000"
        }
    },
    template:
        '<tr>'+
            '<td>{{ color.name | colorName }}</td>'+
            '<td><input type="color" v-model="color.customValue"></td>'+
            '<td><input type="text" v-model="textValue" debounce="1000" @keyup="onKeyup() | debounce 500" :class="{\'ma-failure\': invalidHex}"></td>'+
        '</tr>',
    methods: {
        onKeyup: function () {

        }
    },
    watch: {
        "textValue": function(newVal, oldVal) {
            // Replace 3 digit hex with 6 digit hex
            var parsed = newVal.replace(/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/, "#$1$1$2$2$3$3");
            // Make every hex lowercase
            parsed = parsed.replace(/#[a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9]$/, function (match) {
                return match.toLowerCase();
            });
            if(newVal !== oldVal) {
                let hexRegex = /^#[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]$/;
                if(hexRegex.test(parsed)) {
                    this.color.customValue = parsed;
                    this.textValue = parsed;
                    this.invalidHex = false;
                } else {
                    this.invalidHex = true;
                }
            }
        },
        "color.customValue": function(newVal, oldVal) {
            this.textValue = newVal;
            this.$root.updatePreview();
        }
    }
});
// Component which lists every editable color
var ColorConfigComponent = Vue.extend({
    props: ['colors'],
    template:
        '<div>'+
            '<input type="submit" id="save" class="foswikiSubmit" @click.stop.prevent="this.$root.save()" value="Save"><input type="submit" id="cancel" class="foswikiButtonCancel" @click.stop.prevent="this.$root.cancel()" value="Cancel">'+
        '</div>'+
        '<table class="ma-table ma-striped">'+
            '<thead><tr><th>Color Name</th><th>Pick Color</th><th>Color Value</th></tr></thead>'+
            '<tbody><tr is="vue-set-color" v-for="color in colors" :color="color"></tr></tbody>'+
        '</table>'+
        '<style id="cssPreview"></style>',
    components: {
        'vue-set-color': SetColorComponent
    }
});
Vue.component('vue-color-config', ColorConfigComponent);


jQuery(document).ready(function($) {
    // Get the css file containing every color definition
    $.get('/pub/System/FlatSkin/css/flatskin.colors.css', function(cssString) {
        // Replace literal names with hex
        cssString = cssString.replace(/white/g, "#ffffff");
        cssString = cssString.replace(/grey/g, "#808080");
        cssString = cssString.replace(/black/g, "#000000");
        // Replace 3 digit hex with 6 digit hex
        cssString = cssString.replace(/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])([;\s])/g, "#$1$1$2$2$3$3$4");
        // Make every hex lowercase
        cssString = cssString.replace(/#[a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9]/g, function (match) {
            return match.toLowerCase();
        });
        var regex = /(#[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]|rgba?\([\d\.,\s]*\)|hsla?\([\d\.,\s%]*\))/g;
        var colorMatches = cssString.match(regex); // Array containing lowercase 6 digit hex, rgb(a) and hsl(a), which are considered distinct
        // Create an array of unique colors
        var colors = [];
        for(var i=0, len = colorMatches.length; i < len; i++) {
            if(colors.indexOf(colorMatches[i]) === -1) {
                colors.push(colorMatches[i]);
            }
        }

        // In _settings.scss defined colors
        var maColors = [
            {
                "name": "ma-primary",
                "maValue": "#52cae4",
                "customValue": ""
            },{
                "name": "ma-primary-hover",
                "maValue": "#75d5ea",
                "customValue": ""
            },{
                "name": "ma-success",
                "maValue": "#84bb2e",
                "customValue": ""
            },{
                "name": "ma-success-hover",
                "maValue": "#9dc958",
                "customValue": ""
            },{
                "name": "ma-success-light",
                "maValue": "#e1eecc",
                "customValue": ""
            },{
                "name": "ma-failure",
                "maValue": "#d83314",
                "customValue": ""
            },{
                "name": "ma-failure-hover",
                "maValue": "#e05c43",
                "customValue": ""
            },{
                "name": "ma-failure-light",
                "maValue": "#f5cec6",
                "customValue": ""
            },{
                "name": "ma-warning",
                "maValue": "#e2af19",
                "customValue": ""
            },{
                "name": "ma-warning-hover",
                "maValue": "#eecf75",
                "customValue": ""
            },{
                "name": "ma-warning-light",
                "maValue": "#f6e7ba",
                "customValue": ""
            },{
                "name": "ma-brown",
                "maValue": "#7f7b71",
                "customValue": ""
            },{
                "name": "ma-sand",
                "maValue": "#e5e0d5",
                "customValue": ""
            },{
                "name": "ma-body-text",
                "maValue": "#282c2e",
                "customValue": ""
            },{
                "name": "ma-darker-grey",
                "maValue": "#3E4143",
                "customValue": ""
            },{
                "name": "ma-dark-grey",
                "maValue": "#84878a",
                "customValue": ""
            },{
                "name": "ma-light-grey",
                "maValue": "#e2e2e2",
                "customValue": ""
            },{
                "name": "ma-medium-grey",
                "maValue": "#e5e8eb",
                "customValue": ""
            },{
                "name": "ma-grey",
                "maValue": "#a4aeb9",
                "customValue": ""
            },{
                "name": "ma-bg-beige",
                "maValue": "#f5f3ef",
                "customValue": ""
            },{
                "name": "ma-bg-light",
                "maValue": "#f7f7f7",
                "customValue": ""
            },{
                "name": "ma-light-border",
                "maValue": "#f1efea",
                "customValue": ""
            },{
                "name": "ma-help-text",
                "maValue": "#9a9a9a",
                "customValue": ""
            },{
                "name": "ma-white",
                "maValue": "#ffffff",
                "customValue": ""
            },{
                "name": "ma-black",
                "maValue": "#000000",
                "customValue": ""
            },{
                "name": "ma-select-multi-text-color",
                "maValue": "#8c7b71",
                "customValue": ""
            },{
                "name": "ma-data-table-border",
                "maValue": "#cdd0d3",
                "customValue": ""
            }
        ];

//        $('body').append('<style id="cssPreview"></style>');

        // Create a new Vue instance
        var vm = new Vue({
            el: '#colorconfig',
            data: {
                colors: maColors,
                maCss: cssString
            },
            computed: {
                customCss: {
                    get: function () {
                        var res = this.maCss;
                        for(var i in this.colors) {
                            if(this.colors[i].customValue !== this.colors[i].maValue) {
                                var re = new RegExp(this.colors[i].maValue, "g");
                                res = res.replace(re, this.colors[i].customValue);
                            }
                        }
                        return res;
                    }
                }
            },
            methods: {
                updatePreview: function () {
                    $('#cssPreview').html(this.customCss);
                },
                save: function () {
                    var blob = new Blob([this.customCss], {type: 'text/csv'});
                    if(window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveBlob(blob, "customColors.css");
                    }
                    else{
                        var elem = window.document.createElement('a');
                        elem.href = window.URL.createObjectURL(blob);
                        elem.download = "customColors.css";
                        document.body.appendChild(elem);
                        elem.click();
                        document.body.removeChild(elem);
                    }
                },
                cancel: function () {
                    for(var i in this.colors) {
                        this.colors[i].customValue = this.colors[i].maValue;
                    }
                },
                updateTextFields: function () {
                    for(var i in this.colors) {
                        this.colors[i].customValue = this.colors[i].maValue; //"#123456"
                    }
                }
            }
        });
        vm.updateTextFields();
    });
});
