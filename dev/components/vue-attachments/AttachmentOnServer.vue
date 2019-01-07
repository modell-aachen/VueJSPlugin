<template>
    <div
        :attachment="attachment.name"
        class="attachment-on-server attachments-tile-and-label cell shrink">
        <div
            v-if="!readonly"
            class="attachment-delete"
            @click="deleteAttachment()">
            <i class="far fa-trash" />
        </div>
        <a
            :href="$foswiki.getPubUrl(web, topic, attachment.name, {mode: 'attachment'})">
            <div
                class="attachment-tile">
                <div class="thumbnail">
                    <i
                        :class="iconClass"
                        class="far fa-3x"/>
                </div>

                <img
                    v-if="isPreviewAvailable"
                    :src="previewUrl">
            </div>
            <attachment-label
                :attachment="attachment" />
        </a>
    </div>
</template>

<script>
import {tileSize, thumbnailGeneric, thumbnails} from './helpers';
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
        web: {
            type: String,
            required: true,
            default: '',
        },
        topic: {
            type: String,
            required: true,
            default: '',
        },
        readonly: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    computed: {
        iconClass() {
            let extension = /\.([^.]+)$/.exec(this.attachment.name);
            if(extension) {
                extension =  extension[1].toLowerCase();
                for (let thumbnail of thumbnails) {
                    if(thumbnail.check.test(extension)) {
                        return thumbnail.icon;
                    }
                }
            }
            return thumbnailGeneric;
        },
        isPreviewAvailable() {
            return /\.(?:svg|png|gif|pdf|bmp|jpe?g)$/i.test(this.attachment.name);
        },
        previewUrl() {
            return this.$foswiki.getScriptUrl('rest', 'ImagePlugin', 'resize', {
                topic: this.web + '.' + this.topic,
                file: this.attachment.name,
                size: `${tileSize}x${tileSize}^m`,
                crop: 'NorthWest',
            });
        },
    },
    methods: {
        deleteAttachment() {
            this.$showAlert({
                type: "warning",
                title: this.$t('attachments_delete_title'),
                text: '',
                confirmButtonText: this.$t('attachments_delete_delete'),
                cancelButtonText: this.$t('attachments_delete_keep'),
            }).then(() => {
                this.$emit('delete', this.attachment);
            }).catch(() => {});
        },
    },
};
</script>

<style lang="scss">
@import '../../sass/settings.scss';
.vue-attachments .attachment-on-server {
    position: relative;
    .attachment-delete {
        transition: opacity $ma-animation-time;
        opacity: 0;
        position: absolute;
        z-index: 1;
        background-color: $ma-button-grey;
        top: map-get($spacings, small);
        right: map-get($spacings, small);
        padding: map-get($spacings, small);
        border-radius: $ma-border-radius;
        box-shadow: $ma-shadow-flat;
        cursor: pointer;
    }
    &:hover {
        .attachment-delete {
            opacity: 1;
        }
    }
}
</style>
