<template>
  <vddl-nodrag class="ma-block">
    <div class="ma-simple-item">
      <div class="ma-simple-item-title grid-x align-justify grid-padding-x">
        <div class="cell shrink">
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
    }
  },
};
</script>


<style lang="scss">
.handle {
  cursor: move;
}
</style>
