<template>
  <div>
    {{ item.label }}
  </div>
</template>

<script>
export default {
  props: ['item', 'list', 'index', 'selected', 'selectedItem', 'disable'],
};
</script>
