// Filter to turn "ma-css-color-name" into "Css Color Name"
Vue.filter('colorName', function(cssName) {
    return cssName.replace(/^ma/, "").replace(/-([a-z])/g, function (match, p1) {
        return " "+p1.toUpperCase();
    });
});

// Component displaying the color name and a color picker to change the value
var SetColorComponent = Vue.extend({
    props: ['color'],
    template:
        '<div class="row">'+
            '<div class="column">{{ color.name | colorName }}</div>'+
            '<div class="column">'+
                '<input type="color" v-model="color.value">'+
            '</div>'+
        '</div>'
});
// Component which lists every editable color
var ColorConfigComponent = Vue.extend({
    props: ['colors'],
    template:
        '<div class="table">'+
            '<vue-set-color v-for="(key, value) in colors" :color="{name: key, value: value}"></vue-set-color>'+
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
        var maColors = {
            "ma-primary": "#52cae4",
            "ma-primary-hover": "#75d5ea",
            "ma-success": "#84bb2e",
            "ma-success-hover": "#9dc958",
            "ma-success-transparent": "rgba(132, 187, 46, 0.3)", //ma-success.a = 0.3
            "ma-failure": "#d83314",
            "ma-failure-hover": "#e05c43",
            "ma-failure-transparent": "rgba(216, 51, 20, 0.3)",
            "ma-warning": "#e2af19",
            "ma-warning-hover": "#eecf75",
            "ma-warning-transparent": "rgba(226, 175, 25, 0.3)",
            "ma-brown": "#7f7b71",
            "ma-sand": "#e5e0d5",
            "ma-body-text": "#282c2e",
            "ma-darker-grey": "#3E4143",
            "ma-dark-grey": "#84878a",
            "ma-light-grey": "#e2e2e2",
            "ma-medium-grey": "#e5e8eb",
            "ma-grey": "#a4aeb9",
            "ma-bg-beige": "#f5f3ef",
            "ma-bg-light": "#f7f7f7",
            "ma-light-border": "#f1efea",
            "ma-help-text": "#9a9a9a",
            "ma-white": "#ffffff",
            "ma-black": "#000000",
            "ma-select-multi-text-color": "#8c7b71",
            "ma-data-table-border": "#cdd0d3"
        };

        // Create a new Vue instance
        var vm = new Vue({
            el: '#colorconfig',
            data: {
                colors: maColors
            }
        });

        console.log(cssString, colorMatches, colors, maColors);
        //cssString = cssString.replace(/white/gi, 'red');
        $('body').append('<style>'+cssString+'</style>');
    });
});
