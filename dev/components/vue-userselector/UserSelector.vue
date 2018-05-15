<script type="text/babel">
import VueSelect from '../vue-select/index.js';
export default {
  i18nextNamespace: 'VueJSPlugin',

  extends: VueSelect,

  props: {
    /**
     * Whether 'metadata' should be in the options.
     */
    useMetadata: {
      default: true,
      type: Boolean,
    },
    /**
     * Whether the user is presented with the 'metadata' checkbox.
     */
    metadataOption: {
      default: true,
      type: Boolean,
    },
    /**
     * Whether 'groups' should be in the options.
     */
    useGroups: {
      default: true,
      type: Boolean,
    },
    /**
     * Whether the user is presented with the 'groups' checkbox.
     */
    groupsOption: {
      default: true,
      type: Boolean,
    },
    /**
     * Whether 'users' should be in the options.
     */
    useUsers: {
      default: true,
      type: Boolean,
    },
    /**
     * Whether the user is presented with the 'users' checkbox.
     */
    usersOption: {
      default: true,
      type: Boolean,
    },
    /**
     * Available metadata options.
     */
    metadata: {
      default: () => [],
      type: [Object, Array],
    },
  },
  computed: {
    internalMetadata(){
      let metadataArray;
      if (this.metadata instanceof Object) {
        metadataArray = Object.values(this.metadata).map(function(value){
          let tempData = Object.assign({}, value);
          if(tempData.description && !tempData.label) {
            tempData.label = tempData.description;
          }
          return tempData;
        });
      } else {
        metadataArray = this.metadata;
      }
      let internalMetadata = metadataArray.map(meta => {
        let internal = Object.assign(meta);
        internal.lowerLabel = internal.label.toLocaleLowerCase();
        return internal;
      });
      return internalMetadata.sort((a, b) => a.lowerLabel.localeCompare(b.lowerLabel));
    }
  },
  methods: {
    getFilterOptions() {
      const filterOptions = [];
      if(this.useUsers){
        filterOptions.push({
          label: this.$t('users'),
          name: 'users',
        });
      }
      if(this.useGroups) {
        filterOptions.push({
          label: this.$t('groups'),
          name: 'groups',
        });
      }
      if(this.useMetadata) {
        filterOptions.push({
          label: this.$t('metadata'),
          name: 'metadata',
        });
      }
      return filterOptions;
    },

    getHideOptionsValue() {
      if( this.groupsOption || this.usersOption || this.metadataOption ){
        return false;
      }
      return true;
    },

    getFilteredData(checkedFilterOptions, offsets) {
      return [
        this.getUsersAndGroups(offsets[0] || 0, checkedFilterOptions),
        this.getFilteredMetadata(offsets[1], checkedFilterOptions),
      ];
    },

    getFilteredMetadata(metadataOffset, checkedFilterOptions) {
      if(!checkedFilterOptions.metadata) {
        return Promise.resolve([]);
      }

      let filteredMetadata = this.internalMetadata.filter((item) => {
        return item.lowerLabel.indexOf(this.search.toLowerCase()) !== -1;
      });
      if(metadataOffset) {
        filteredMetadata = filteredMetadata.slice(metadataOffset);
      }
      return Promise.resolve(filteredMetadata);
    },

    getUsersAndGroups(queryUsersGroupsOffset, checkedFilterOptions) {
      let search = this.search;

      // present only the metadata when search is empty
      if((!this.search.length && checkedFilterOptions.metadata) || (!checkedFilterOptions.users && !checkedFilterOptions.groups)) {
        this.lastAjax = null;
        return Promise.resolve([]);
      }

      if(this.lastSearch === search && this.lastUseGroups === checkedFilterOptions.groups && this.lastUseUsers === checkedFilterOptions.users && this.lastOffset === queryUsersGroupsOffset && this.lastAjax) {
        return Promise.resolve(this.lastAjax.data);
      }

      let type;
      if(checkedFilterOptions.users && checkedFilterOptions.groups) {
        type = 'any';
      } else if(checkedFilterOptions.users) {
        type = 'user';
      } else {
        type = 'group';
      }

      return this.makeAjaxRequest({
        name: 'QUERYUSERS',
        urlparam: 'term', // page only works, if urlparam is set
        term: this.search,
        offset: queryUsersGroupsOffset,
        type: type,
        limit: this.dataLimit,
        header: '{$quotdata$quot:[',
        separator: ',',
        footer: '],$quotcount$quot:$quot$count$quot}',
        format: '{$quotlabel$quot:$quot$displayName$quot,$quotvalue$quot:$quot$cUID$quot,$quottype$quot:$quotuser$quot}',
        groupformat: '{$quotlabel$quot:$quot$displayName$quot,$quotvalue$quot:$quot$wikiName$quot,$quottype$quot:$quotgroup$quot}',
      }).then(json => {
        this.lastAjax = json;
        this.lastOffset = queryUsersGroupsOffset;
        this.lastUseGroups = checkedFilterOptions.groups;
        this.lastUseUsers = checkedFilterOptions.users;
        this.lastSearch = search;
        return this.lastAjax.data;
      });
    },
    makeAjaxRequest(params) { // this method is here to simplify karma mocks
      return this.$http.get(
        this.$foswiki.getScriptUrl('rest', 'RenderPlugin', 'tag'),
        {
          params
        }
      ).then(res => {
        return res.json(); // for some reason jsonp did not work
      });
    },


  },
};
</script>

<style lang="scss">
</style>
