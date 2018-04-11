import CheckItem from '../dev/components/vue-check-item/CheckItem.vue';
import TestCase from '../dev/unit-test-library/main';

let mount = TestCase.mount;
describe("The CheckItem component", () => {
  describe("with default values", () => {
    const wrapper = mount(CheckItem);
    it("renders an empty Checkbox", () => {
      const input = wrapper.find('input');
      expect(input.attributes().type).toBe('checkbox');
      expect(wrapper.classes()).toContain('ma-switch');
      expect(wrapper.attributes().disabled).not.toBe('disabled');
      expect(wrapper.find('label').exists()).toBe(true);
    });
  });
  describe("model updates", () => {
    beforeEach(() => {
      const options = {
        propsData: {
          name: 'test[]',
          value: 'Foo',
          checked: true,
          modelValue: ['Foo']
        },
      };
      this.wrapper = mount(CheckItem, options);
    });
    it("when changing prop", () => {
      expect(this.wrapper.vm.state).toBe(true);
      expect(this.wrapper.vm.modelValue).toContain('Foo');
      this.wrapper.setProps({modelValue: []});
      expect(this.wrapper.vm.state).toBe(false);
    });
    xit("with user interaction", () => {
      const input = this.wrapper.find('input');
      expect(this.wrapper.vm.state).toBe(true);
      expect(this.wrapper.vm.modelValue).toContain('Foo');
      //input.element.value=true;
      input.trigger('click');
      //this.wrapper.trigger('click');
      expect(this.wrapper.vm.state).toBe(false);
      expect(this.wrapper.vm.modelValue).not.toContain('Foo');
    });
  });
});

