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
        '<div class="row">'+
            '<div class="column">{{ color.name | colorName }}</div>'+
            '<div class="column">'+
                '<input type="color" v-model="color.customValue">'+
            '</div>'+
            '<div class="column">'+
                '<input type="text" v-model="textValue" debounce="1000" @keyup="onKeyup() | debounce 500" :class="{\'ma-failure\': invalidHex}">'+
            '</div>'+
        '</div>',
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
                console.log(this.textValue);
            }
        },
        "color.customValue": function(newVal, oldVal) {
            this.textValue = newVal;
            this.$root.replaceColor(this.color.maValue, newVal);
        },
        "asdf": function (newVal, oldVal) {
            console.log(oldVal, newVal, this.justChanged, this.invalidHex);
            if(newVal !== oldVal) {
                // Replace 3 digit hex with 6 digit hex
                newVal = newVal.replace(/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])([;\s])/g, "#$1$1$2$2$3$3$4");
                // Make every hex lowercase
                newVal = newVal.replace(/#[a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9]/g, function (match) {
                    return match.toLowerCase();
                });
                let hexRegex = /^#[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]$/;
                if(hexRegex.test(newVal)) {
                    this.color.customValue = newVal;
                    this.$root.replaceColor(this.color.maValue, newVal);
                    if(!this.justChanged) {
                        console.log("+++++", newVal);
                        this.invalidHex = false;
                    }
                    this.justChanged = false;
                } else {
                    this.invalidHex = true;
                    this.justChanged = true;
                    this.color.customValue = oldVal;
                    console.log("-----", oldVal);
                }
            }
        }
    }
});
// Component which lists every editable color
var ColorConfigComponent = Vue.extend({
    props: ['colors'],
    template:
        '<div class="table">'+
            '<vue-set-color v-for="color in colors" :color="color"></vue-set-color>'+
        '</div>',
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
                "customValue": "#52cae4",
            },{
                "name": "ma-primary-hover",
                "maValue": "#75d5ea",
                "customValue": "#75d5ea",
            },{
                "name": "ma-success",
                "maValue": "#84bb2e",
                "customValue": "#84bb2e",
            },{
                "name": "ma-success-hover",
                "maValue": "#9dc958",
                "customValue": "#9dc958",
            },{
                "name": "ma-success-light",
                "maValue": "#e1eecc",
                "customValue": "#e1eecc",
            },{
                "name": "ma-failure",
                "maValue": "#d83314",
                "customValue": "#d83314",
            },{
                "name": "ma-failure-hover",
                "maValue": "#e05c43",
                "customValue": "#e05c43",
            },{
                "name": "ma-failure-light",
                "maValue": "#f5cec6",
                "customValue": "#f5cec6",
            },{
                "name": "ma-warning",
                "maValue": "#e2af19",
                "customValue": "#e2af19",
            },{
                "name": "ma-warning-hover",
                "maValue": "#eecf75",
                "customValue": "#eecf75",
            },{
                "name": "ma-warning-light",
                "maValue": "#f6e7ba",
                "customValue": "#f6e7ba",
            },{
                "name": "ma-brown",
                "maValue": "#7f7b71",
                "customValue": "#7f7b71",
            },{
                "name": "ma-sand",
                "maValue": "#e5e0d5",
                "customValue": "#e5e0d5",
            },{
                "name": "ma-body-text",
                "maValue": "#282c2e",
                "customValue": "#282c2e",
            },{
                "name": "ma-darker-grey",
                "maValue": "#3E4143",
                "customValue": "#3E4143",
            },{
                "name": "ma-dark-grey",
                "maValue": "#84878a",
                "customValue": "#84878a",
            },{
                "name": "ma-light-grey",
                "maValue": "#e2e2e2",
                "customValue": "#e2e2e2",
            },{
                "name": "ma-medium-grey",
                "maValue": "#e5e8eb",
                "customValue": "#e5e8eb",
            },{
                "name": "ma-grey",
                "maValue": "#a4aeb9",
                "customValue": "#a4aeb9",
            },{
                "name": "ma-bg-beige",
                "maValue": "#f5f3ef",
                "customValue": "#f5f3ef",
            },{
                "name": "ma-bg-light",
                "maValue": "#f7f7f7",
                "customValue": "#f7f7f7",
            },{
                "name": "ma-light-border",
                "maValue": "#f1efea",
                "customValue": "#f1efea",
            },{
                "name": "ma-help-text",
                "maValue": "#9a9a9a",
                "customValue": "#9a9a9a",
            },{
                "name": "ma-white",
                "maValue": "#ffffff",
                "customValue": "#ffffff",
            },{
                "name": "ma-black",
                "maValue": "#000000",
                "customValue": "#000000",
            },{
                "name": "ma-select-multi-text-color",
                "maValue": "#8c7b71",
                "customValue": "#8c7b71",
            },{
                "name": "ma-data-table-border",
                "maValue": "#cdd0d3",
                "customValue": "#cdd0d3"
            }
        ];

        $('body').append('<style id="cssPreview"></style>');

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
                replaceColor: function (maValue, customValue) {
                    $('#cssPreview').html(this.customCss);
                }
            }
        });
    });
});
