import Input from '../dev/components/vue-input-text/InputText.vue';
import TestCase from '../dev/unit-test-library/main';


const createInput = (options) => {
    delete Input.inject;
    return TestCase.mount(Input, options);
};

describe("The InputText component", () => {
    describe("validates content", () => {
        const options = {
            propsData: {
                name: 'test-input',
                validate: 'email',
            }
        };
        const wrapper = createInput(options);
        it("and show error on validation error", () => {
            wrapper.setProps({value: 'no email'});
            return Vue.nextTick()
                .then(function() {
                    expect(wrapper.classes()).toContain('ma-failure');
                    expect(wrapper.find('input').attributes()['aria-invalid']).toBe('true');
                    expect(wrapper.contains('small')).toBe(true);
                    expect(wrapper.find('small').text()).toBe("The test-input field must be a valid email.");
                });
        });
    });
});
