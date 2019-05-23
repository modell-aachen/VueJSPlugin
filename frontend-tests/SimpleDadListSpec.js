import DadListTestComponent from './DadListTestComponent.vue';
import TestCase from '../dev/unit-test-library/main';


describe("The DadListComponent component", () => {
    let wrapper;
    beforeEach(() => {
        wrapper = TestCase.mount(DadListTestComponent);
    });

    afterEach(() => {
        wrapper.destroy();
    });

    it("can add a list item", () => {
        wrapper.vm.list.push({
            id: 3,
            type: "metadataBlock",
            label: "Item A2",
            status: "warning",
            fields: [
                [
                    {
                        id: 107,
                        label: "SubItem 1",
                        type: "status",
                    },
                    {
                        id: 108,
                        label: "SubItem 2",
                        type: "status",
                    },
                ],
                [],
            ],
        });
    });

});
