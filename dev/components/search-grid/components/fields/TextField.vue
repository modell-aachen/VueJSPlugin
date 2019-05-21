<template>
    <div>{{ doc[params[0]] }}</div>
</template>

<script>
import FieldMixin from "./FieldMixin.vue";

export default {
    mixins: [FieldMixin],
};
</script>
