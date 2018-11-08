import TestCase from '../dev/unit-test-library/main';

/* eslint-disable no-console */
describe("The MAVueJSPlugin ", () => {
    describe("instantiateEach method requires a container", () => {
        let container;
        let tokenTag;
        beforeEach(function(){
            container = document.createElement('div');
            container.setAttribute('id', "test");
            tokenTag = document.createElement('script');
            tokenTag.setAttribute("type", "application/json");
            tokenTag.classList.add('vue-client-registrations');
            document.querySelector('body').appendChild( container );
            document.querySelector('head').appendChild( tokenTag );
            console.warn = jasmine.createSpy("warn");
        });

        afterEach(function() {
            container.remove();
            tokenTag.remove();
        });

        it("warns on missing attributes.", () => {
            TestCase.vue.instantiateEach('#test');
            expect(console.warn).toHaveBeenCalled();
        });

        it("warns on wrong token", () => {
            tokenTag.innerHTML = '{ "token" : "xxxx" }';
            container.setAttribute('data-vue-client-token', 'token');

            TestCase.vue.instantiateEach('#test');
            expect(console.warn).toHaveBeenCalled();
        });

        it("warns _not_ with correct attributes and token", () => {

            tokenTag.innerHTML = '{ "token" : "token" }';
            container.setAttribute('data-vue-client-token', "token");

            TestCase.vue.instantiateEach('#test');

            expect(console.warn).not.toHaveBeenCalled();
        });
    });
});
/* eslint-enable no-console */
