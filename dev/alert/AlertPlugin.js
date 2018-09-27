import BaseAlertPlugin from './BaseAlertPlugin';
import VueSweetAlert from 'vue-sweetalert';

class AlertPlugin extends BaseAlertPlugin {
    install(Vue) {
        Vue.use(VueSweetAlert);
        super.install(Vue);
    }
    _getSwalInstance(instance, config) {
        return instance.$swal(config);
    }
}

export default AlertPlugin;
