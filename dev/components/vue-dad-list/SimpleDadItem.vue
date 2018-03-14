<template>
      <vddl-nodrag class="ma-block">
        <div class="ma-simple-item">
          <div class="ma-simple-item-title grid-x align-justify grid-padding-x">
            <div class="cell shrink">
              <div class="grid-x ma-collapsible-item-title-left grid-padding-x">
                <div class="cell shrink align-self-middle handle-container">
                  <vddl-handle :handleLeft="0" :handleTop="0" class="fal fa-bars handle"></vddl-handle>
                </div>
                <div class="cell shrink align-self-middle">
                  <h3>{{item.label}}<i v-if="item.status" class="fas fa-circle ma-status-dot" :class="item.status"></i><small v-if="item.subLabel">{{item.subLabel}}</small></h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vddl-nodrag>
</template>

<script>
export default {
  props: ['item', 'index'],
};
</script>


<style lang="scss">
.handle {
  cursor: move;
}
</style>
