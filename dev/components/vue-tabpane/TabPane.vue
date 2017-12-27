<template>
    <div class="flatskin-wrapped vue-tabpane">
        <div class="jqTabPaneFlat">
            <ul class="vue-tabpane-group">
                <li
                    v-for="(tab, index) in tabs"
                    :key="index"
                    :class="{current: tab.current}"
                >
                    <a
                        v-html="tab.name"
                        @click.prevent="selectTab(tab.id)"
                        href="#"
                    >
                    </a>
                </li>
            </ul>
            <span class="clearfix"></span>
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
  name: 'vue-tabpane',
  data: () => ({
    tabs: [],
  }),
  mounted() {
    if(this.$children.length) {
      this.tabs = this.$children;
      this.tabs[0].current = true;
    }
  },
  methods: {
    selectTab(selectedTabId) {
      this.$children.forEach(tab => {
        tab.current = (tab.id === selectedTabId);
      });
    },
  },
};
</script>

<style lang="scss">
ul.vue-tabpane-group,
#modacWrapper ul.vue-tabpane-group {
    margin: 0;
    padding: 0;
    list-style: none;
    display: block;
    float: left;
    overflow: visible !important;

    li {
        float: left;
        list-style: none;
    }

    a:hover,
    a {
        text-decoration: none;
        white-space: nowrap;
        float: left;
        display: block;
        text-shadow: 0 1px #fff;
    }
    a:focus {
        outline: none;
    }
}
</style>
