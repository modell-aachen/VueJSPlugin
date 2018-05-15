// XXX use something like $(...).text()
const getText = nodes => nodes.map(child => {
  if(!child) {
    return '';
  }
  return child.text !== undefined ? child.text : '';
}).join('');

module.exports = {
  props: {
    /**
     * Set to false, if you do not want to automatically sort the options
     * provided via option tags in the default slot.
     * This can be useful to imitate a usual select, however will produce weird
     * lists when merged with other sources.
     */
    sortSlotOptions: {
      type: [Boolean, String],
      default: true,
    },

    /**
     * This option will be used for ajax requests to 'replace' the options
     * provided as slots. When not set: continue offering slot options.
     */
    dataUrl: {
      type: String,
      default: '',
    },

    /**
     * Like slot options these are available from the start and will be
     * replaced when ajax requests occur.
     * Now they are reactive.
     */
    initialOptions: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    slotOptions() {
      let slotOptions = this.$slots.default ? this.$slots.default : [];

      let values = {};
      this.value.forEach(item => {
        values[item.value] = 1;
      });

      slotOptions = slotOptions.filter(element => element.tag === 'option');

      let count = 0;
      slotOptions = slotOptions.map(node => {
        let children = node.children || [];

        let label = getText(children);

        let option = {
          compare: label.toLocaleLowerCase(),
          value: (node.data && node.data.attrs && node.data.attrs.value !== undefined ? node.data.attrs.value : node.text),
          id: 'slot' + count++,
        };
        option[this.optionLabel] = label;

        if(node.data && node.data.attrs && node.data.attrs.selected && !values[option.value]) {
          this.value.push(option);
        }

        return option;
      });

      this.initialOptions.forEach(option => {
        label = option[this.optionLabel];
        let formattedOption = {
          value: option.value,
          compare: label.toLocaleLowerCase(),
          id: 'slot' + count++,
        };
        formattedOption[this.optionLabel] = label;
        count++;
        slotOptions.push(formattedOption);
      });

      if(this.sortSlotOptions && this.sortSlotOptions !== '0') {
        slotOptions.sort((a, b) => {
          return a.compare.localeCompare(b.compare);
        });
      }

      return slotOptions;

    }
  },
  methods: {
    getSlotData(offset) {
      if(this.dataUrl === '') {
        let filteredOptions = this.slotOptions.filter(item => item.compare.indexOf(this.search) !== -1);
        filteredOptions = filteredOptions.slice(offset);
        return Promise.resolve(filteredOptions);
      }

      let urlParts = [
        this.dataUrl.replace(/;/g, '&'),
        'term=' + encodeURIComponent(this.search),
      ];
      if(this.dataLimit !== '' && this.dataLimit !== '0') {
        urlParts.push(
          'page=' + ((offset || 0) / this.dataLimit),
          'limit=' + this.dataLimit
        );
      }
      return this.$http.get(
        urlParts.join('&')
      ).then(res => {
        return res.json().then(data => { // for some reason jsonp did not work
          if(!(data && data.results)) {
            return [];
          }
          return data.results.map(item => {
            return {
              value: item.id,
              label: item.text,
            };
          });
        });
      });
    },
  },
};
