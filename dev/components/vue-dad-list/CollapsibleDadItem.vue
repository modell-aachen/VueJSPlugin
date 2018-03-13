<template>
    <vddl-draggable class="panel__body--item"
      :draggable="draggable"
      :index="index"
      :item="item"
      :wrapper="wrapper"
      effect-allowed="move">
      <vddl-nodrag class="ma-block">
        <div class="ma-block">
          <div class="ma-block__title grid-x align-justify">
            <div class="cell shrink">
              <div class="grid-x">
                <div class="cell shrink">
                  <vddl-handle handleLeft="0" handleTop="0" class="handle"></vddl-handle>
                </div>
                <div class="cell shrink">
                  {{item.label}}
                </div>
              </div>
            </div>
            <div class="cell shrink">
              HANDLE
            </div>
          </div>
        </div>
      </vddl-nodrag>
    </vddl-draggable>
</template>

<script>
export default {
  props: ['item', 'list', 'index', 'selected', 'selectedItem', 'disable'],
};
</script>


<style lang="scss">
.handle {
  cursor: move;
  width: 20px;
  height: 20px;
  background-color: green;
  background-size: 20px 20px;
}
</style>
