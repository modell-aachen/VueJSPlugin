import Input from '../dev/components/vue-input-text/InputText.vue';
import {mount} from '@vue/test-utils';

describe("The InputText component", () => {
  describe("with default values", () => {
    const wrapper = mount(Input);
    it("has correct html structure", () => {
      expect(wrapper.contains('.ma-input-group')).toBe(true);
      expect(wrapper.contains('label')).toBe(false);
      expect(wrapper.contains('input')).toBe(true);
      expect(wrapper.attributes().disabled).not.toBe('disabled');
    });
  });
  describe("use propertie", () => {
    const options = {
      propsData: {
        label: 'TEST',
        name: 'test-input',
        placeholder: 'PLACEHOLDER',
        icon: ['fas','fa-paperclip'],
        isSmall: true,
        isDisabled: true,
      }
    };
    const wrapper = mount(Input, options);
    it("label", () => {
      expect(wrapper.contains('label')).toBe(true);
      expect(wrapper.find('label').html()).toContain(options.propsData.label);
    });
    it("name", () => {
      expect(wrapper.find('input').attributes().name).toBe(options.propsData.name);
    });
    it("placeholder", () => {
      expect(wrapper.find('input').attributes().placeholder).toBe(options.propsData.placeholder);
    });
    it("icon", () => {
      expect(wrapper.find('i').classes()).toContain(options.propsData.icon[1]);
    });
    it("isSmall", () => {
      expect(wrapper.find('input').classes()).toContain('ma-small');
    });
    it("isDisabled", () => {
      expect(wrapper.find('input').attributes().disabled).toBe('disabled');
    });
  });
  describe("validates content", () => {
    const options = {
      propsData: {
        name: 'test-input',
        validate: 'email',
        errorMessage: 'FEHLER'
      }
    };
    const wrapper = mount(Input, options);
    it("and show error on validation error", () => {
      wrapper.setProps({value: 'no email'});
      return Vue.nextTick()
        .then(function() {
          wrapper.update();
          expect(wrapper.classes()).toContain('ma-failure');
          expect(wrapper.find('input').attributes()['aria-invalid']).toBe('true');
          expect(wrapper.contains('small')).toBe(true);
          expect(wrapper.find('small').text()).toBe(options.propsData.errorMessage);
        });
    });
  });
  describe("send typed event", () => {
    const options = {
      propsData: {
        name: 'test-input',
        validate: 'email'
      }
    };
    const wrapper = mount(Input, options);
    it("every time data changes", () => {
      wrapper.setData({data: 'eins'});
      wrapper.setData({data: 'zwei'});
      wrapper.setData({data: 'drei'});
      const events = wrapper.emitted().typed;
      expect(events.length).toBe(3);
    });
    it("with correct data", () => {
      wrapper.setData({data: 'neuer Text'});
      const events = wrapper.emitted().typed;
      expect(events[events.length - 1][0]).toBe('neuer Text');
    });
  });
});
