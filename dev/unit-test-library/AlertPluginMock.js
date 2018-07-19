class AlertPluginMock {
    install(Vue) {
        const alertPlugin = this;
        Vue.prototype.$showAlert = function(config) {
            return alertPlugin._showAlert(this, config);
        };
    }
    _showAlert(instance, config) {
        const swalConfig = this._getSwalBaseConfigBy(config.type);

        swalConfig.title = config.title;
        swalConfig.text = config.text;
        swalConfig.confirmButtonText = config.confirmButtonText;
        swalConfig.cancelButtonText = config.cancelButtonText;

        return swalConfig;
    }
    _getSwalBaseConfigBy(type) {
        switch(type) {
            case 'error':
                break;
            case 'warning':
                break;
            case 'success':
                break;
            default:
                throw(new Error(`Type '${type}' is not implemented for alerts.`));
        }
        return {type};
    }
}

export default AlertPluginMock;

