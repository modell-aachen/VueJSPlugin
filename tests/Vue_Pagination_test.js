import Pagination from '../dev/components/vue-pagination/VueSimplePagination.vue';
import {mount} from '@vue/test-utils';

describe("The Pagination component", () => {
  describe("with minimal values", () => {
    const options = {
      propsData: {
        value: 1,
        pageCount: 2
      }
    };
    const wrapper = mount(Pagination, options);
    it("renders a 7 items long list", () => {
      expect(wrapper.contains('div')).toBe(true);
      expect(wrapper.classes()).toContain('vue-simple-pagination');
      expect(wrapper.find('nav').exists()).toBe(true);
      expect(wrapper.find('ul').exists()).toBe(true);
    });
    it("triggers page-changed event at click", () => {
      const pageTwo = wrapper.findAll('a').at(2);
      pageTwo.trigger('click');
      expect(wrapper.emitted()['input'][0]).toContain(2);
    });
  });
  describe("list renders correct", () => {
    const options = {
      propsData: {
        value: 1,
        pageCount: 50
      }
    };
    const wrapper = mount(Pagination, options);
    it("when 1st page is active", () => {
      const expectations = [
        'disabled',
        'active',
        'clickable',
        'clickable',
        'clickable',
        'clickable',
        'disabled',
        'clickable',
        'clickable',
      ];
      const navigations = wrapper.findAll('li');
      for(let i = 0; i < navigations.length; i++) {
        const item = navigations.at(i);
        expect(item.classes()).toContain(expectations[i]);
      }
    });
    it("when last page is active", () => {
      wrapper.setProps({value: 50});
      const expectations = [
        'clickable',
        'clickable',
        'disabled',
        'clickable',
        'clickable',
        'clickable',
        'clickable',
        'active',
        'disabled',
      ];
      const navigations = wrapper.findAll('li');
      for(let i = 0; i < navigations.length; i++) {
        const item = navigations.at(i);
        expect(item.classes()).toContain(expectations[i]);
      }
    });
    it("when 6th page is active", () => {
      wrapper.setProps({value: 6});
      const expectations = [
        'clickable',
        'clickable',
        'disabled',
        'clickable',
        'active',
        'clickable',
        'disabled',
        'clickable',
        'clickable',
      ];
      const navigations = wrapper.findAll('li');
      for(let i = 0; i < navigations.length; i++) {
        const item = navigations.at(i);
        expect(item.classes()).toContain(expectations[i]);
      }
    });
    it("when last-5 page is active", () => {
      wrapper.setProps({value: 45});
      const expectations = [
        'clickable',
        'clickable',
        'disabled',
        'clickable',
        'active',
        'clickable',
        'disabled',
        'clickable',
        'clickable',
      ];
      const navigations = wrapper.findAll('li');
      for(let i = 0; i < navigations.length; i++) {
        const item = navigations.at(i);
        expect(item.classes()).toContain(expectations[i]);
      }
    });
    it("when last-4 page is active", () => {
      wrapper.setProps({value: 46});
      const expectations = [
        'clickable',
        'clickable',
        'disabled',
        'active',
        'clickable',
        'clickable',
        'clickable',
        'clickable',
        'clickable',
      ];
      const navigations = wrapper.findAll('li');
      for(let i = 0; i < navigations.length; i++) {
        const item = navigations.at(i);
        expect(item.classes()).toContain(expectations[i]);
      }
    });
  });
});

