import BaseAlertPlugin from '../alert/BaseAlertPlugin';

const mock = {
    confirmations: [],
    setConfirmationTo: function (confirmations) {
        if (!(confirmations instanceof Array)) {
            confirmations = [confirmations];
        }
        this.confirmations = confirmations;
    }
};

class AlertPluginMock extends BaseAlertPlugin {
    install(Vue) {
        super.install(Vue);
        Vue.prototype.$showAlert.mock = mock;
    }
    _getSwalInstance(instance, config) {
        mock.config = config;
        return new Promise(function(resolve, reject) {
            const isConfirmed = (mock.confirmations.shift() !== false);
            if (isConfirmed) {
                resolve();
            } else {
                reject();
            }
        });
    }
}

export default AlertPluginMock;

