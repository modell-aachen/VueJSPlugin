class BaseAlertPlugin {
    install(Vue) {
        const alertPlugin = this;
        Vue.prototype.$showAlert = function(config) {
            return alertPlugin._showAlert(this, config);
        };
    }
    _showAlert(instance, config) {
        const swalConfig = {};
        swalConfig.title = config.title;
        swalConfig.titleText = config.titleText;
        swalConfig.text = config.text;
        swalConfig.html = config.html;
        swalConfig.confirmButtonText = config.confirmButtonText;
        swalConfig.cancelButtonText = config.cancelButtonText;
        Object.assign(swalConfig, this._getSwalBaseConfigBy(config.type));
        if("allowOutsideClick" in config){
            swalConfig.allowOutsideClick = config.allowOutsideClick;
        }
        if("allowEscapeKey" in config){
            swalConfig.allowEscapeKey = config.allowEscapeKey;
        }
        if("showCancelButton" in config){
            swalConfig.showCancelButton = config.showCancelButton;
        }
        if("confirmButtonClass" in config){
            swalConfig.confirmButtonClass = config.confirmButtonClass;
        }
        return this._getSwalInstance(instance, swalConfig);
    }
    _getSwalInstance(/*instance, config*/) {
        throw(new Error("needs to be implemented"));
    }
    _getSwalBaseConfigBy(type) {
        const baseConfig = {
            buttonsStyling: false,
            customClass: "flatskin-wrapped",
            cancelButtonClass: "button",
        };

        switch(type) {
            case 'error':
                baseConfig.type = 'error';
                baseConfig.showCancelButton = false;
                baseConfig.confirmButtonClass = "delete button";
                break;
            case 'defaulterror':
                baseConfig.type = 'error';
                baseConfig.showCancelButton = false;
                baseConfig.confirmButtonClass = "delete button";
                baseConfig.title = Vue.t('default_error_title', {ns: 'VueJSPlugin'});
                baseConfig.text = Vue.t('default_error_text', {ns: 'VueJSPlugin'});
                baseConfig.confirmButtonText = Vue.t('ok', {ns: 'VueJSPlugin'});
                break;
            case 'warning':
                baseConfig.type = 'warning';
                baseConfig.showCancelButton = true;
                baseConfig.confirmButtonClass = "delete button";
                break;
            case 'info':
                baseConfig.type = 'info';
                baseConfig.confirmButtonClass = "primary button";
                break;
            case 'confirm':
                baseConfig.showCancelButton = true;
                baseConfig.confirmButtonClass = "primary button";
                break;
            case 'success':
                baseConfig.type = 'success';
                baseConfig.showCancelButton = false;
                baseConfig.confirmButtonClass = "primary button";
                break;
            default:
                throw(new Error(`Type '${type}' is not implemented for alerts.`));
        }

        return baseConfig;
    }
}

export default BaseAlertPlugin;

