<template>
      <vddl-nodrag class="ma-block">
        <div class="ma-collapsible-item">
          <div class="ma-collapsible-item-title grid-x align-justify grid-padding-x">
            <div class="cell shrink">
              <div class="grid-x ma-collapsible-item-title-left grid-padding-x">
                <div class="cell shrink align-self-middle handle-container">
                  <vddl-handle v-if="item.collapsed" :handleLeft="0" :handleTop="0" class="fal fa-bars handle"></vddl-handle>
                </div>
                <div class="cell shrink align-self-middle">
                  <h3>{{item.label}}<i v-if="item.status" class="fas fa-circle ma-status-dot" :class="item.status"></i><small v-if="item.subLabel">{{item.subLabel}}</small></h3>
                </div>
              </div>
            </div>
            <div class="cell shrink align-self-middle">
              <span @click.prevent="toggleCollapsed"><i class="fas" :class="chevronByCollapsed"></i></span>
            </div>
          </div>
          <div class="ma-collapsible-item-animation-clipper">
            <transition name="collapsible-item-slide-y">
            <div class="ma-collapsible-item-content" v-if="!item.collapsed">
              <div class="grid-container fluid">
                <slot></slot>
              </div>
            </div>
            </transition>
          </div>
        </div>
      </vddl-nodrag>
</template>

<script>
export default {
  props: ['item', 'index'],
  data: function() {
    return {
    };
  },
  computed: {
    chevronByCollapsed: function() {
      return this.item.collapsed ? 'fa-chevron-right' : 'fa-chevron-down';
    }
  },
  methods: {
    toggleCollapsed: function() {
      this.item.collapsed = !this.item.collapsed;
    }
  }
};
</script>


<style lang="scss">
.handle {
  cursor: move;
}
.ma-collapsible-item-animation-clipper {
    overflow: hidden;
}
.collapsible-item-slide-y-enter-active,
.collapsible-item-slide-y-leave-active {
    transition: all .3s;
}
.collapsible-item-slide-y-enter,
.collapsible-item-slide-y-leave-to {
    transform: translate(0, -100%);
    /*
      unfortunately this will not look good, because browsers make too few reflows
      height: 0px;
     */
}
</style>
