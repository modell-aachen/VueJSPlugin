<template>
<div>
  <div class="header">
    <slot name="header"></slot>
  </div>
  <div class="content">
   <slot name="content"></slot>
  </div>
</div>
</template>

<style lang="scss">
@import './sass/settings';

.tab-contents {
  .header{
    padding: $sidebar-content-padding;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;

    max-height: $sidebar-header-height;
    min-height: $sidebar-header-height;
    width: 100%;
    border-bottom: 2px solid $light-gray;
  }
}
</style>
