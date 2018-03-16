<template>
  <div>
    <vddl-list
      class="panel__body--list"
      :list="list"
      :allowed-types="allowedTypes"
      :horizontal="false">
      <template v-for="(item, index) in list">
        <vddl-draggable
          class="panel__body--item"
          :type="item.type"
          :key="item.id"
          :draggable="item"
          :index="index"
          :wrapper="list"
          effect-allowed="move">
          <slot
            :item="item"
            :index="index"/>
        </vddl-draggable>
      </template>
      <slot name="placeholder">
        <vddl-placeholder>
          <div
            :is="itemType"
            :item="dummyItem"
            :index="99999"/>
        </vddl-placeholder>
      </slot>
    </vddl-list>
    <slot
      name="addArea"
      :add="addItemEvent">
      <vue-button
        title="Add"
        @click.native="addItemEvent"/>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'DadList',
  props: {
    'label':{
      type: String,
      default: undefined
    },
    'list':{
    },
    'itemType': {
    },
    'allowedTypes': {
      type: Array,
    }
  },
  data: function() {
    return {
      dummyItem: {
        "id": 5,
        "label": "",
        "collapsed": true
      }
    };
  },
  methods: {
    addItemEvent: function() {
      this.$emit("addItem");
    }
  }
};
</script>
<style lang="scss">
.vddl-list {
    min-height: 24px;
}
.vddl-list, .vddl-draggable {
    position: relative;
}
.vddl-dragging {
    opacity: .7;
}
.vddl-placeholder{
    opacity: 0.4;
}

.vddl-dragging-source {
    display: none;
}
</style>
