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
    swalConfig.text = config.text;
    swalConfig.confirmButtonText = config.confirmButtonText;
    swalConfig.cancelButtonText = config.cancelButtonText;

    return instance.$swal(swalConfig);
  }
  _getSwalBaseConfigBy(type) {
    const baseConfig = {
      buttonsStyling: false,
      customClass: "flatskin-wrapped",
      cancelButtonClass: "button"
    };

    switch(type) {
      case 'warning':
        baseConfig.type = 'warning';
        baseConfig.showCancelButton = true;
        baseConfig.confirmButtonClass = "delete button";
        break;
      default:
        throw(new Error(`Type '${type}' is not implemented for alerts.`));
    }

    return baseConfig;
  }
}

export default AlertPlugin;
