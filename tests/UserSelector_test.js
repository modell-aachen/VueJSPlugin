import UserSelector from '../dev/components/vue-userselector/UserSelector.vue';
import TestCase from '../dev/unit-test-library/main';

describe("The UserSelector component's", () => {
    let userselector;
    describe("toggleDropdown", () => {
        beforeEach(() => {
            userselector = TestCase.createVueComponent(UserSelector, {});
            spyOn(userselector, 'updateDropdown').and.returnValue();
            userselector.$mount();
        });

        it("should open/close the dropdown", (done) => {
            expect(userselector.open).toBe(false);
            userselector.toggleDropdown();
            expect(userselector.open).toBe(true);

            // Unfortunately it seems the blur event does not trigger inside the tests.
            // This is a 'better than nothing' attempt
            spyOn(userselector.$refs.search, 'blur');
            userselector.toggleDropdown();
            expect(userselector.$refs.search.blur).toHaveBeenCalled();

            done();
        });

        it("should focus on the input when opening", (done) => {
            spyOn(userselector.$refs.search, 'focus');
            userselector.toggleDropdown();
            userselector.$nextTick(() => {
                expect(userselector.$refs.search.focus).toHaveBeenCalled();
                done();
            });
        });
    });

    describe("updateDropdown", () => {
        const mockUsers = [{"label":"Aabbee Aabel","value":"814cb581-acc5-4c98-b4a7-568f89666668","type":"user"},{"label":"Aaliyah Gombert","value":"11670372-247c-48bb-86e2-71f5ebdfb4b9","type":"user"},{"label":"Aaron Farin","value":"34426db2-a7f3-44d5-ac56-f27ed2f9a445","type":"user"},{"label":"Aaron XXX","value":"484532b0-a13c-4229-a43e-7345465424b3","type":"user"},{"label":"Aaron Zaituc","value":"81f879f9-ec75-423d-947f-df3887696946","type":"user"},{"label":"Abadon Tothova","value":"69016743-f2e7-46a8-8d7a-2b7ec6bb18d1","type":"user"},{"label":"Abagail Wilderman","value":"1f0f9876-bdb6-4cd3-9718-aceac77d80c0","type":"user"},{"label":"Abdiel Cummerata","value":"ac360f0a-070e-4f94-acd9-1189b39520b6","type":"user"},{"label":"Abdiel Vandervort","value":"a95a840f-64a3-4081-830a-0f3a09474520","type":"user"},{"label":"Abel Collins","value":"2bd274b0-73a6-4cb2-80cf-fca2ea21fb55","type":"user"},{"label":"Abigayle Tremblay","value":"12a57fc0-9fda-4772-b494-f80c4a57a090","type":"user"},{"label":"Abner McKenzie","value":"0b70b3dc-2132-4bfa-a89b-76e2f8eaa557","type":"user"},{"label":"Abner Sporer","value":"6f4d744f-82be-4c64-a7ba-2059a44b1a5f","type":"user"},{"label":"Abraham Burianek","value":"64e0ced6-c0f4-4798-83cf-7cc68c45f029","type":"user"},{"label":"Abraham Pisa","value":"d85f5904-cd2d-47a9-9508-77fe197c43e3","type":"user"},{"label":"Abramo Bruno","value":"87051fb1-dfc2-482f-ba74-cffe5ae270bf","type":"user"},{"label":"Abramo Gatti","value":"eb87d8f2-c65c-4814-bee3-85b282d24024","type":"user"},{"label":"Abramo Montanari","value":"d2e1a0ab-675a-4523-8056-6955b24fa047","type":"user"},{"label":"Abramo Rinaldi","value":"ddea6254-0105-46ff-9fef-cac32e537fb8","type":"user"},{"label":"Adah Graham","value":"421670d0-dae2-4ba1-8086-2e67164d0ddb","type":"user"},{"label":"Adam Bonnet","value":"c8626b86-3361-4c81-81a6-c10af1548d0c","type":"user"},{"label":"Adam Meyer","value":"a5896c95-f12b-4a35-b6e8-a01ed98ebe79","type":"user"},{"label":"Adam Michel","value":"23138e8a-ba7a-4f76-9106-fdd70bc92bf0","type":"user"},{"label":"Adam Morin","value":"ce0171a0-3869-4f09-9074-511f4926eb67","type":"user"},{"label":"Adam Nguyen","value":"56830541-2a0a-486b-8b84-07111bdfed06","type":"user"},{"label":"Adam Nicolas","value":"09433196-a662-4967-9249-bafb64d93bb5","type":"user"}];
        const mockUsersCount = 4668;
        const mockMetadata = [
            { label: "aaa meta1", lowerLabel: "aaa meta1", type: "metadata", id: "meta1" },
            { label: "Aaron ZZZ meta2", lowerLabel: "aaron zzz meta2", type: "metadata", id: "meta2" },
            { label: "Abner X meta3", lowerLabel: "abner x meta3", type: "metadata", id: "meta3" },
        ];
        const expected = mockUsers.concat(mockMetadata).sort((a, b) => a.label.localeCompare(b.label));

        beforeEach(() => {
            userselector = TestCase.createVueComponent(UserSelector, {
                propsData: {
                    metadata: mockMetadata.slice(),
                },
            });
            userselector.$mount();
            spyOn(userselector, 'makeAjaxRequest').and.callFake(params => {
                return Promise.resolve({ data: mockUsers.slice(params.offset, params.offset + params.limit), count: mockUsersCount});
            });
        });

        it("returns just metadata, if there is no search string and metadata is available", (done) => {
            userselector.checkedFilterOptions.metadata = 1;
            userselector.updateDropdown().then(() => {
                expect(userselector.options).toEqual(mockMetadata);
                done();
            }).catch(e => fail(e));
        });

        it("returns users/groups, if there is no search string and metadata is disabled", (done) => {
            userselector.checkedFilterOptions.metadata = 0;
            userselector.updateDropdown().then(() => {
                expect(userselector.options).toEqual(mockUsers.slice(0, userselector.dataLimit));
                done();
            }).catch(e => fail(e));
        });

        it("uses a cached response, only if the parameters did not change", (done) => {
            userselector.search = 'a';
            userselector.checkedFilterOptions.users = 1;

            userselector.updateDropdown().then(() => {
                expect(userselector.makeAjaxRequest).toHaveBeenCalled();
                userselector.makeAjaxRequest.calls.reset();

                userselector.updateDropdown().then(() => {
                    expect(userselector.makeAjaxRequest).not.toHaveBeenCalled();

                    userselector.search = 'b';
                    userselector.updateDropdown().then(() => {
                        expect(userselector.makeAjaxRequest).toHaveBeenCalled();
                        userselector.makeAjaxRequest.calls.reset();

                        userselector.checkedFilterOptions.users = 0;
                        userselector.updateDropdown().then(() => {
                            expect(userselector.makeAjaxRequest).toHaveBeenCalled();
                            userselector.makeAjaxRequest.calls.reset();

                            userselector.checkedFilterOptions.users = 1;
                            userselector.updateDropdown().then(() => {
                                expect(userselector.makeAjaxRequest).toHaveBeenCalled();
                                done();
                            });
                        });
                    });
                });
            }).catch(e => fail(e));
        });

        it("mixes metadata and users, if there is a search string", (done) => {
            userselector.search = 'a';

            userselector.updateDropdown().then(() => {
                expect(userselector.options).toEqual(expected.slice(0,10)); // first page

                userselector.updateDropdown(true).then(() => {
                    expect(userselector.options).toEqual(expected.slice(0, 20)); // second page

                    userselector.updateDropdown(true).then(() => {
                        expect(userselector.options).toEqual(expected); // third page with less than 10 entries
                        done();
                    });
                });
            }).catch(e => fail(e));
        });
    });
});

