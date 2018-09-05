import VueSweetAlert from 'vue-sweetalert';

class AlertPlugin {
    install(Vue) {
        Vue.use(VueSweetAlert);

        const alertPlugin = this;
        Vue.prototype.$showAlert = function(config) {
            return alertPlugin._showAlert(this, config);
        };
    }
    _showAlert(instance, config) {
        const swalConfig = this._getSwalBaseConfigBy(config.type);

        swalConfig.title = config.title;
        swalConfig.titleText = config.titleText;
        swalConfig.text = config.text;
        swalConfig.html = config.html;
        swalConfig.confirmButtonText = config.confirmButtonText;
        swalConfig.cancelButtonText = config.cancelButtonText;
        swalConfig.allowOutsideClick = false;

        return instance.$swal(swalConfig);
    }
    _getSwalBaseConfigBy(type) {
        const baseConfig = {
            buttonsStyling: false,
            customClass: "flatskin-wrapped",
            cancelButtonClass: "button"
        };

        switch(type) {
            case 'error':
                baseConfig.type = 'error';
                baseConfig.showCancelButton = false;
                baseConfig.confirmButtonClass = "delete button";
                break;
            case 'warning':
                baseConfig.type = 'warning';
                baseConfig.showCancelButton = true;
                baseConfig.confirmButtonClass = "delete button";
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

export default AlertPlugin;
