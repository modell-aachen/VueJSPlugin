<template>
  <vddl-nodrag class="ma-block">
    <div class="ma-collapsible-item">
      <!-- Title Area -->
      <div
        :class="{'ma-collapsed': item.collapsed}"
        class="ma-collapsible-item-title grid-x align-justify grid-padding-x">
        <div class="cell shrink">
          <div class="grid-x ma-collapsible-item-title-left grid-padding-x">
            <div class="cell shrink align-self-middle handle-container">
              <vddl-handle
                v-if="item.collapsed"
                :handle-left="0"
                :handle-top="0"
                class="fal fa-bars handle"/>
            </div>
            <div class="cell shrink align-self-middle">
              <h3>{{ item.label }}<i
                v-if="item.status"
                :class="item.status"
                class="fas fa-circle ma-status-dot"/><small v-if="item.subLabel">{{ item.subLabel }}</small></h3>
            </div>
          </div>
        </div>
        <div class="cell auto align-self-middle">
          <!-- Dummy Drop List -->
          <vue-dad-list
            v-if="item.fields && item.collapsed"
            :allowed-types="['status']"
            :list="dummyDropList"
            item-type="vue-simple-dad-item">
            <vddl-placeholder slot="placeholder">
              <div class="ma-simple-dad-item-drop-area">
                <h3>Feld in diesen Inhaltsblock verschieben</h3>
              </div>
            </vddl-placeholder>
            <div slot="addArea"/>
          </vue-dad-list>
        </div>
        <div class="cell shrink align-self-middle">
          <span @click.prevent="toggleCollapsed"><i
            :class="chevronByCollapsed"
            class="fas"/></span>
        </div>
      </div>
      <div class="ma-collapsible-item-animation-clipper">
        <transition name="collapsible-item-slide-y">
          <div
            v-if="!item.collapsed"
            class="ma-collapsible-item-content">
            <div class="grid-container fluid">
              <slot/>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </vddl-nodrag>
</template>

<script>
export default {
  name: 'CollapsibleDadItem',
  props: {
    item:{
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    multiOpen: {
      type: Boolean,
      default: false
    },
    lastOpend: {
      type: [String, Number],
      default: null
    }
  },
  data: function() {
    return {
      dummyDropList: []
    };
  },
  computed: {
    chevronByCollapsed: function() {
      return this.item.collapsed ? 'fa-chevron-right' : 'fa-chevron-down';
    }
  },
  watch: {
    dummyDropList: function(newList) {
      if(this.item.fields[0]) {
        this.item.fields[0].push(newList[0]);
      }
    },
    lastOpend: function(lastOpenedItemId) {
      if(this.multiOpen === null || this.multiOpen === false) {
        if(lastOpenedItemId !== this.item.id) {
          this.item.collapsed = true;
        }
      }
    }
  },
  methods: {
    toggleCollapsed: function() {
      this.item.collapsed = !this.item.collapsed;
      if(!this.item.collapsed) {
        this.$emit('lastOpend', this.item.id);
      }
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
