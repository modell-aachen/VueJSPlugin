<template>
    <li
        :class="{current: isCurrent}">
        <!-- eslint-disable vue/no-v-html -->
        <a
            :class="{'hasSubMenu': hasSub}"
            href="#"
            @click.prevent="onSelect"
            v-html="name" />
            <!-- eslint-enable -->
    </li>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            required: true,
        },
        isCurrent: {
            type: Boolean,
            default: false,
        },
        hasSub: {
            type: Boolean,
            required: true,
        },
        name: {
            type: String,
            default: "",
        },
        originalIndex: {
            type: Number,
            required: true,
        },
    },
    methods: {
        onSelect() {
            this.$emit('select', this.id);
        },
    },
};
</script>

