import Sidebar from '../dev/components/sidebar/Sidebar.vue';
import TestCase from '../dev/unit-test-library/main';

describe("The Sidebar component", () => {
    let sidebar;
    beforeEach(() => {
        sidebar = createSidebar({});
    });
    it("should not show any tabs if none are defined.", () => {
        expect(sidebar.tabs.length).toEqual(0);
    });
    it("should have tabs if defined.", () => {
        sidebar = createSidebar({tabs: [{tooltip: 'foo', icon: 'fa-times'},{tooltip: 'bar', icon: 'fa-circe'}]});
        expect(sidebar.tabs.length).toEqual(2);
    });
    it("should show first tab when active.", () => {
        sidebar.show();
        expect(sidebar.selectedTab).toEqual(0);
    });
    describe("show method", () => {
        it("should activate the sidebar.", () => {
            expect(sidebar.isActive).toEqual(false);
            sidebar.show();
            expect(sidebar.isActive).toEqual(true);
        });
        it("should activate the sidebar only once.", () => {
            expect(sidebar.isActive).toEqual(false);
            sidebar.show();
            sidebar.show();
            expect(sidebar.isActive).toEqual(true);
        });
    });
    describe("hide method", () => {
        it("should deactivate the sidebar.", () => {
            sidebar.isActive = true;
            sidebar.hide();
            expect(sidebar.isActive).toEqual(false);
        });
        it("should deactivate the sidebar only once.", () => {
            sidebar.isActive = true;
            sidebar.hide();
            sidebar.hide();
            expect(sidebar.isActive).toEqual(false);
        });
        it("should deactivate when sidebar is not active.", () => {
            sidebar.hide();
            expect(sidebar.isActive).toEqual(false);
        });
    });
    describe("modal method", () => {
        it("should activate the modal.", () => {
            sidebar.showModal({});
            expect(sidebar.isModalActive).toEqual(true);
        });
        it("should deactivate the modal when it is active.", () => {
            sidebar.showModal({});
            sidebar.hideModal();
            expect(sidebar.isModalActive).toEqual(false);
        });
        it("should use confirm-modal as default type.", () => {
            sidebar.showModal({});
            expect(sidebar.modalOptions.type).toEqual('confirm-modal');
        });
    });
    describe("close-confirmation dialog", () => {
        const template = '<div><sidebar ref="sidebar" @before-hide="onBeforeHide"></sidebar></div>';

        it("opens, when a consumer asks for it", () => {
            let wrapper = TestCase.mount({
                name: 'TestComponent',
                template,
                methods: {
                    onBeforeHide: callbacks => callbacks.showConfirmDialog(),
                },
            });
            spyOn(wrapper.vm.$refs.sidebar, '$showAlert').and.callThrough();
            wrapper.vm.$refs.sidebar.hide({allowConfirmation: true});
            expect(wrapper.vm.$refs.sidebar.$showAlert).toHaveBeenCalled();
        });
        it("keeps quiet when nobody asks it to show", () => {
            let wrapper = TestCase.mount({
                name: 'TestComponent',
                template,
                methods: {
                    onBeforeHide: () => {},
                },
            });
            spyOn(wrapper.vm.$refs.sidebar, '$showAlert').and.callThrough();
            wrapper.vm.$refs.sidebar.hide({allowConfirmation: true});
            expect(wrapper.vm.$refs.sidebar.$showAlert).not.toHaveBeenCalled();
        });
        it("requires an option to act", () => {
            let wrapper = TestCase.mount({
                name: 'TestComponent',
                template,
                methods: {
                    onBeforeHide: callbacks => expect(callbacks.showConfirmDialog).not.toBeDefined(),
                },
            });
            spyOn(wrapper.vm.$refs.sidebar, '$showAlert').and.callThrough();
            wrapper.vm.$refs.sidebar.hide();
            expect(wrapper.vm.$refs.sidebar.$showAlert).not.toHaveBeenCalled();
        });
    });
});

function createSidebar (props){
    delete Sidebar.inject;
    const wrapper = TestCase.mount(Sidebar, {
        propsData: props,
    });
    return wrapper.vm;
}
