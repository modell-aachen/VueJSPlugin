import PagedSelector from '../dev/components/vue-paged-selector/VuePagedSelector.vue';
import TestCase from '../dev/unit-test-library/main';

describe("The PagedSelector component's", () => {
  let initialOptions = [
    {value: '0', label: 'Test Zero', description: 'A test item'},
    {value: '1', label: 'Test One', description: 'Another test item'},
    {value: '2', label: 'Test Two', description: ''},
    {value: '3', label: 'Test Three'},
    {value: '4', label: '4'},
    {value: '5', label: '5', description: 'Here starts page two'},
    {value: '6', label: '6'},
    {value: '7', label: 'Test four plus three'},
    {value: '8', label: 'Test four times two'},
    {value: '9', label: '9'},
    {value: '10', label: '10', description: 'Here starts page three'},
    {value: '11', label: '11'},
  ];
  let pagedSelector;
  beforeEach(() => {
    pagedSelector = TestCase.createVueComponent(PagedSelector, {
      propsData: {
        options: initialOptions,
      },
    });
    pagedSelector.$mount();
  });
  describe("filtered options", () => {
    it("filters according to the input", () => {
      pagedSelector.filter = 'three'; // find 'three' and 'Three'
      pagedSelector.$nextTick(() => {
        expect(pagedSelector.filteredOptions.length).toBe(2);
        expect(pagedSelector.filteredOptions[0].value).toBe('3');
        expect(pagedSelector.filteredOptions[1].value).toBe('7');
        expect(pagedSelector.pageCount).toBe(1);

        pagedSelector.filter = 'test';
        pagedSelector.$nextTick(() => {
          expect(pagedSelector.filteredOptions.length).toBe(6);
          expect(pagedSelector.displayedOptions.length).toBe(5);
          expect(pagedSelector.pageCount).toBe(2);
        });
      });
    });

    it("respects the pager", () => {
      pagedSelector.page = 3;
      pagedSelector.$nextTick(() => {
        expect(pagedSelector.displayedOptions.length).toBe(2);
        expect(pagedSelector.displayedOptions[0].value).toBe('10');
      });
    });

    it("is the options converted to the internal format", () => {
      expect(pagedSelector.filteredOptions[1]).toEqual({
        key: 2,
        value: '1',
        label: 'Test One',
        badge: undefined,
        description: 'Another test item',
        compare: 'test one',
      });
    });

    it("reacts to new options", () => {
      pagedSelector.options = [
        {value: 'new', label: 'New'}
      ];
      pagedSelector.$nextTick(() => {
        expect(pagedSelector.displayedOptions.length).toBe(1);
        expect(pagedSelector.displayedOptions[0].value).toBe('new');
        expect(pagedSelector.pageCount).toBe(1);
      });
    });
  });
});

