<template>
    <div
        class="attachment-label">
        <template
            v-for="(word, idx) in splitWordParts">
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline vue/multiline-html-element-content-newline -->
            <template v-if="idx !== 0">&#8203;</template>{{ word }}</template>
    </div>
</template>

<script>
export default {
    i18nextNamespace: 'VueJSPlugin',
    props: {
        attachment: {
            type: Object,
            required: true,
            default: () => {},
        },
    },
    computed: {
        splitWordParts() {
            let text = this.attachment.presented_name || this.attachment.name;
            return text.split(/(\d+|[\][\s\\/\u2215\u2044'"*~#´`^°@<>|;:€§$%&=+_,.(){}?!-])/).filter(x => x !== "");
        },
    },
};

</script>
