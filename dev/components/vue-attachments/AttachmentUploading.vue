<template>
    <div
        class="attachments-tile-and-label cell shrink">
        <div
            class="attachment-tile in-transit">
            <div
                class="progress-bar">
                <div
                    v-if="attachment.percentComplete"
                    :style="{width: attachment.percentComplete + '%'}"
                    class="meter" />
            </div>
        </div>
        <attachment-label
            :attachment="attachment" />
    </div>
</template>

<script>
import AttachmentLabel from './AttachmentLabel';

export default {
    i18nextNamespace: 'VueJSPlugin',
    components: {
        AttachmentLabel,
    },
    props: {
        attachment: {
            type: Object,
            required: true,
            default: () => {},
        },
    },
}
</script>
