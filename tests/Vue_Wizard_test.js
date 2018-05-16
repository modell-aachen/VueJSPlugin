import Wizard from '../dev/components/vue-wizard/VueWizard.vue';
import TestCase from '../dev/unit-test-library/main';

describe("The Wizard component's", () => {
    describe("iconClass", () => {
        it("has the correct default value", () => {
            let wizard = TestCase.createVueComponent(Wizard, {
                propsData: {
                    params: [],
                },
            });
            wizard.$mount();
            expect(wizard.iconClass).toBe('far fa-magic fa-2x');
        });
        it("adds the far class if there isn't any such class", () => {
            ['', 'fa-times', 'fa-2x fa-times'].forEach( iconClass => {
                let wizard = TestCase.createVueComponent(Wizard, {
                    propsData: {
                        params: [undefined, iconClass],
                    },
                });
                wizard.$mount();
                expect(wizard.iconClass).toContain(iconClass);
                expect(wizard.iconClass).toContain('far');
            });
        });
        it("does not add the far class if there already is such class", () => {
            ['fas fa-times', 'fa-times fal', 'fa fa-times fa-2x'].forEach( iconClass => {
                let wizard = TestCase.createVueComponent(Wizard, {
                    propsData: {
                        params: [undefined, iconClass],
                    },
                });
                wizard.$mount();
                expect(wizard.iconClass).toContain(iconClass);
                expect(wizard.iconClass).not.toContain('far');
            });
        });
        it("adds the fa-2x class if there isn't any such class", () => {
            ['', 'fa-times', 'far fa-times'].forEach( iconClass => {
                let wizard = TestCase.createVueComponent(Wizard, {
                    propsData: {
                        params: [undefined, iconClass],
                    },
                });
                wizard.$mount();
                expect(wizard.iconClass).toContain(iconClass);
                expect(wizard.iconClass).toContain('fa-2x');
            });
        });
        it("does not add the fa-2x class if there already is such class", () => {
            ['fa-100x fa-times', 'fa-times fa-1x', 'far fa-3x fa-times'].forEach( iconClass => {
                let wizard = TestCase.createVueComponent(Wizard, {
                    propsData: {
                        params: [undefined, iconClass],
                    },
                });
                wizard.$mount();
                expect(wizard.iconClass).toContain(iconClass);
                expect(wizard.iconClass).not.toContain('fa-2x');
            });
        });
    });
});

