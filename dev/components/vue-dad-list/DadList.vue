<template>
  <div>
    <vddl-list class="panel__body--list" :list="list" :horizontal="false">
      <template v-for="(item, index) in list">
        <vddl-draggable class="panel__body--item"
          :key="item.id"
          :draggable="item"
          :index="index"
          :wrapper="list"
          effect-allowed="move">
          <slot :item="item" :index="index">
          </slot>
        </vddl-draggable>
      </template>
      <vddl-placeholder>
        <div :is="itemType" :item="dummyItem" :index="99999"></div>
      </vddl-placeholder>
      <vue-button title="Add" @click.native="add"></vue-button>
    </vddl-list>
  </div>
</template>

<script>
export default {
  props: {
    'label':{
      type: String,
      default: undefined
    },
    'list':{
    },
    'itemType': {
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
    add: function() {
      this.list.push({
        "id": 5,
        "label": "New Item A1",
        "collapsed": false
      });
    }
  }
};
</script>
<style lang="scss">
.vddl-list {
    min-height: 44px;
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
