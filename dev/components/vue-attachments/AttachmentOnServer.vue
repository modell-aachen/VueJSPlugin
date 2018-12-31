<template>
    <div
        :attachment="attachment.name"
        class="attachment-on-server attachments-tile-and-label cell shrink">
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
};
</script>
