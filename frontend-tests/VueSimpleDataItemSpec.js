import SimpleItem from '../dev/components/vue-dad-list/SimpleDadItem.vue';
import TestCase from '../dev/unit-test-library/main';


const createItem = (options) => {
    delete SimpleItem.inject;
    return TestCase.mount(SimpleItem, options);
};


describe("The SimpleDadItem component", () => {

    describe("displays the items title ", () => {

        let options = {
            propsData: {
                item: {},
                index: 0,
            },
        };

        ['label', 'description'].map((propKey) => {

            options.propsData.item[propKey] = 'Test';
            const wrapper = createItem(options);
            it("given by " + propKey, () => {
                expect(wrapper.contains('h3')).toBe(true);
                expect(wrapper.find('h3').html()).toContain(options.propsData.item[propKey]);
            });

        });
    });

    describe("remove button", () => {

        let options = {};

        beforeEach(() => {
            options = {
                propsData: {
                    item: {},
                    index: 0,
                },
                listeners: {},
            };
        });

        it('exists if `remove-item` callback is given', () => {
            options.listeners['remove-item'] = jasmine.createSpy('remove-item');
            const wrapper = createItem(options);
            expect(wrapper.contains('a.button')).toBe(true);
        });

        it('does not exsits if `remove-item` callback is unset', () => {
            const wrapper = createItem(options);
            expect(wrapper.contains('a.button')).toBe(false);
        });

    });

});
