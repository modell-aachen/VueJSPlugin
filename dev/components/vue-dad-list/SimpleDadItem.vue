<template>
  <vddl-nodrag class="ma-block">
    <div class="ma-simple-item">
      <div
      :class="{'ma-simple-item--removeable': itemRemoveable}"
      class="cell grid-x align-justify grid-padding-x" >
        <div :class="{'small-10': itemRemoveable}" class="cell ma-simple-item-title">
          <div class="grid-x ma-collapsible-item-title-left grid-padding-x">
            <div class="cell shrink align-self-middle handle-container">
              <vddl-handle
                :handle-left="0"
                :handle-top="0"
                class="fal fa-bars handle"/>
            </div>
            <div class="cell shrink align-self-middle">
              <h3>{{ item.label || item.description }}<i
                v-if="item.status"
                :class="item.status"
                class="fas fa-circle ma-status-dot"/><small v-if="item.subLabel">{{ item.subLabel }}</small></h3>
            </div>
          </div>
        </div>
        <div
          v-if="itemRemoveable"
          class="cell small-2 align-self-middle">
          <vue-button
            type="icon"
            icon="far fa-times"
            @click.native.prevent="$emit('remove-item', item)" />
        </div>
      </div>
    </div>
  </vddl-nodrag>
</template>

<script>
export default {
  name: 'SimpleItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
  },
  computed: {
    itemRemoveable: function() {
      return this.$listeners && this.$listeners['remove-item'];
    }
  }
};
</script>


<style lang="scss">
.handle {
  cursor: move;
}

.ma-simple-item h3 {
  margin-bottom: 0;
}

.ma-simple-item--removeable .cell.ma-simple-item-button {
    padding-left: 0;
    padding-right: 0;
    text-align: right;
}
</style>
