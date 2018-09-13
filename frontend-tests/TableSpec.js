import TestCase from '../dev/unit-test-library/main';
import TableComponent from '../dev/components/vue-table/Table.vue'

describe("The table component", () => {
    let table;

    const clickOnTableHeader = async (index) => {
        table.find(`thead tr th:nth-of-type(${index + 1})`).trigger('click');
        await Vue.nextTick();

    };

    const getLastSortChangedEvent = () => {
        const sortChangedEvents = table.emitted("sort-changed");
        if(!sortChangedEvents){
            return undefined;
        }
        return sortChangedEvents[sortChangedEvents.length - 1][0];
    };

    const getTableHeaderTexts = () => {
        return table.findAll("thead tr th").wrappers.map((tableHeadWrapper) => {
            return tableHeadWrapper.text();
        });
    };

    const getColumnTextsForRow = (index) => {
        return getWrapperForRow(index).findAll(".test-column").wrappers.map((columnWrapper) => {
            return columnWrapper.text();
        });
    };

    const getWrapperForRow = (index) => {
        return table.find(`tbody tr:nth-of-type(${index + 1})`);
    };

    beforeEach(() => {
        table = TestCase.mount(TableComponent, {
            propsData: {
                columns: [{
                    headerText: "First name",
                    enableSort: true
                }, {
                    headerText: "Last name",
                    enableSort: false
                }],
                data: [{
                    firstName: "John",
                    lastName: "Johnson"
                },{
                    firstName: "Lisa",
                    lastName: "Lisason"
                }]
            },
            scopedSlots: {
                "column0": "<div class='test-column'>{{props.item.firstName}}</div>",
                "column1": "<div clasS='test-column'>{{props.item.lastName}}</div>"
            }
        });
    });

    it('shows a table row for each item in the data array', TestCase.wrapAsync(async () => {
        expect(getWrapperForRow(0).exists()).toBe(true);
        expect(getWrapperForRow(1).exists()).toBe(true);
    }));

    it('shows the configured amount of table columns per table row', TestCase.wrapAsync(async () => {
        expect(getWrapperForRow(0).findAll("td").length).toBe(2);
    }));

    it('shows the configured table head texts', TestCase.wrapAsync(async () => {
        expect(getTableHeaderTexts()).toEqual(["First name", "Last name"]);
    }));

    it("sends an ascending sort event when a non sorted but sortable header is clicked", TestCase.wrapAsync(async () => {
        await clickOnTableHeader(0);
        
        expect(getLastSortChangedEvent()).toEqual({
            sortedColumnIndex: 0, 
            sortOrder: "asc"
        });
    }));

    it("sends a descending sort event when an ascending sorted header is clicked", TestCase.wrapAsync(async () => {
        table.setProps({
            sortedColumnIndex: 0,
            sortOrder: 'asc'
        });

        await clickOnTableHeader(0);
        
        expect(getLastSortChangedEvent()).toEqual({
            sortedColumnIndex: 0,
            sortOrder: "desc"
        });
    }));

    it("sends an ascending sort event when a descending sorted header is clicked", TestCase.wrapAsync(async () => {
        table.setProps({
            sortedColumnIndex: 0,
            sortOrder: 'desc'
        });

        await clickOnTableHeader(0);
        
        expect(getLastSortChangedEvent()).toEqual({
            sortedColumnIndex: 0,
            sortOrder: "asc"
        });
    }));

    it("does not send a sort event when clicking on a non sortable header", TestCase.wrapAsync(async () => {
        await clickOnTableHeader(1);

        expect(getLastSortChangedEvent()).toBe(undefined);
    }));

    it("shows the defined column slots", TestCase.wrapAsync(async () => {
        const actualTableValues = [
            getColumnTextsForRow(0),
            getColumnTextsForRow(1)
        ];
        const expectedTableValues = [
            ["John", "Johnson"],
            ["Lisa", "Lisason"]
        ];
        expect(actualTableValues).toEqual(expectedTableValues);
    }));
});