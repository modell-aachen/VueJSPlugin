let foswiki = {
    preferences: {
        SCRIPTURL: "rest"
    },
    jsi18n: {
        get(module, text){
            return "MT:" + text;
        }
    },
    getPreference(preference) {
        return `Value of ${preference}`;
    },
    getPubUrl() {
        return "http://wiki.de/pub";
    },
    getScriptUrl: function() {
        return "http://wiki.de/script";
    },
    getScriptUrlPath: function(scriptName) {
        return "http://wiki.de/bin/"+scriptName;
    }
};

export default foswiki;
