<template>
    <div
        class="vue-attachments ma-margin-top-medium">
        <div
            :id="dropzoneId"
            class="dropzone-wrapper grid-x grid-margin-x grid-margin-y patternEditTopic">
            <div
                :class="{'dropzone-overlay--active': $upload.dropzone(uploadId).active }"
                class="dropzone-overlay">
                <p>
                    <i class="fas fa-upload"/>
                    <br>
                    {{ $t('upload_dnd_area') }}
                </p>
            </div>
            <div
                v-if="canUpload"
                class="attachments-tile-and-label cell shrink"
                @click="$upload.select(uploadId)">
                <div
                    class="upload-box attachment-tile">
                    <div class="upload-icon"><i class="fa fa-3x fa-upload"/></div>
                    <div>{{ $t('upload_file') }}</div>
                </div>
                <div
                    class="attachment-label upload-label">
                    {{ $t('upload_dnd') }}
                </div>
            </div>
            <div
                v-for="attachment in internalAttachments"
                :key="attachment.name"
                :attachment="attachment.name"
                class="attachments-tile-and-label cell shrink">
                <a
                    :href="$foswiki.getPubUrl(internalWeb, internalTopic, attachment.name, {mode: 'attachment'})">
                    <div
                        class="attachment-tile">
                        <div class="thumbnail">
                            <i
                                :class="getIconFor(attachment)"
                                class="far fa-3x"/>
                        </div>

                        <img
                            v-if="isPreviewAvailableFor(attachment)"
                            :src="getPreviewFor(attachment)">
                    </div>
                    <div
                        class="attachment-label">
                        <template
                            v-for="(word, idx) in splitWordParts(attachment.presented_name || attachment.name)"><template v-if="idx !== 0">&#8203;</template>{{ word }}</template>
                    </div>
                </a>
            </div>
            <div
                v-for="attachment in $upload.files(uploadId).progress"
                :key="getUniqueId(attachment)"
                class="attachments-tile-and-label cell shrink">
                <div
                    class="attachment-tile in-transit">
                    <div
                        class="progress-bar">
                        <div
                            :style="{width: attachment.percentComplete + '%'}"
                            class="meter" />
                    </div>
                </div>
                <div
                    class="attachment-label">
                    <template
                        v-for="(word, idx) in splitWordParts(attachment.presented_name || attachment.name)"><template v-if="idx !== 0">&#8203;</template>{{ word }}</template>
                </div>
            </div>
            <div
                v-for="(attachment, idx) in $upload.files(uploadId).queue"
                :key="idx"
                class="attachments-tile-and-label cell shrink">
                <div
                    class="attachment-tile in-transit">
                    <div
                        class="progress-bar" />
                </div>
                <div
                    class="attachment-label">
                    <template
                        v-for="(word, idx) in splitWordParts(attachment.presented_name || attachment.name)"><template v-if="idx !== 0">&#8203;</template>{{ word }}</template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const tileSize = 114;
const thumbnailGeneric = 'fa-file';
const thumbnails = [
    {
        check: /^(?:png|svg|bmp|gif|jpe?g|tiff?|jp2|jpx|eps|ppm|ico|xcf)$/,
        icon: 'fa-file-image',
    },
    {
        check: /^pdf$/,
        icon: 'fa-file-pdf',
    },
    {
        check: /^(?:zip|rar|tgz|gz|bz|tar)$/,
        icon: 'fa-file-archive',
    },
    {
        check: /^(?:do[ct][xm]?|docb)$/,
        icon: 'fa-file-word',
    },
    {
        check: /^(?:ppt[xm]?|pot[xm]?|ppam|ppsx?|ppsm|sld[xm])$/,
        icon: 'fa-file-powerpoint',
    },
    {
        check: /^(?:xls[xmb]?|xlt[xm]?|xml|xlam|xla|ods)$/,
        icon: 'fa-file-excel',
    },
    {
        check: /^(?:aac|aifc|aiff?|ape|flac|m3u|m4a|mp3|ogg|wav|wma)$/,
        icon: 'fa-file-audio',
    },
    {
        check: /^(?:3g2|3gp|asf|avi|m4p|m4v|mkv|mov|mp4|mpe?g|ogv|rmvb|vob|webm|wmv)$/,
        icon: 'fa-file-video',
    },
];

// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions?redirectlocale=en-US&redirectslug=JavaScript%2FGuide%2FRegular_Expressions
const escapeRegExp = function(unescaped) {
    return unescaped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export default {
    i18nextNamespace: 'VueJSPlugin',
    props: {
        attachments: {
            type: Array,
            required: false,
            default: () => [],
        },
        attachmentsJson: {
            type: String,
            required: false,
            default: '',
        },
        web: {
            type: String,
            default: '',
            required: false,
        },
        topic: {
            type: String,
            default: '',
            required: false,
        },
        block: {
            type: String,
            default: '',
            required: false,
        },
        readonly: {
            type: [Boolean, String],
            default: false,
            required: false,
        },
        attachmentNameFilter: {
            type: String,
            default: '',
            required: false,
        },
        extensions: {
            type: String,
            default: '',
            required: false,
        },
    },
    data() {
        let internalAttachments = [];
        if(this.attachments && this.attachments.length) {
            internalAttachments.push(...this.attachments);
        }
        if(this.attachmentsJson && this.attachmentsJson.length) {
            try {
                let parsedJson = JSON.parse(this.attachmentsJson);
                if(Array.isArray(parsedJson)) {
                    internalAttachments.push(...parsedJson);
                } else {
                    window.console.warn('attachmentsJson is in wrong format', attachmentsJson);
                }
            } catch(e) {
                window.console.warn("error parsing json", e);
            }
        }
        let internalWeb = this.web ? this.web : this.$foswiki.getPreference('WEB');
        let internalTopic = this.topic ? this.topic : this.$foswiki.getPreference('TOPIC');
        let uploadId = `vue-attachments ${internalWeb}.${internalTopic}#${this.block}`;
        let dropzoneId = 'dropzone' + Vue.getUniqueId();
        let canUpload = !(this.readonly === true || this.readonly === "1" || this.readonly === 1);
        return {
            canUpload,
            internalAttachments,
            internalWeb,
            internalTopic,
            uploadId,
            dropzoneId,
        };
    },
    created() {
        // note: a beforeUnloadHandler interferes with the browser's cache, thus we only install it when needed
        this.beforeUnloadHandler = (event) => {
            if(this.$upload.files(this.uploadId).progress.length || this.$upload.files(this.uploadId).queue.length) {
                event.preventDefault();
            }
        };

        if(this.attachmentNameFilter) {
            try {
                this.attachmentNameFilterRegexp = new RegExp(this.attachmentNameFilter, 'g'); // note: this can fail because the regexp is perlish
            } catch(e) {
                window.console.warn('Could not filter attachment name using NAMEFILTER', foswikiNameFilter, e);
            }
        }

        document.documentElement.addEventListener("dragover", (e) => {
            if (e.target.id !== this.dropzoneId) {
                e.preventDefault();
                e.dataTransfer.effectAllowed = "none";
                e.dataTransfer.dropEffect = "none";
            }
        });
    },
    mounted() {
        // https://github.com/websanova/vue-upload
        this.$upload.on(this.uploadId, {
            url: this.$foswiki.getScriptUrl('upload', this.internalWeb, this.internalTopic),
            maxSizePerFile: parseInt(this.$foswiki.getPreference('ATTACHFILESIZELIMIT')) * 1024 || 0,  //ATTACHFILESIZELIMIT comes as kb, however we need bytes here
            extensions: this.extensions ? this.extensions.replace(/\s/g, '').split(/,/) : false,
            async: false,
            maxFilesSelect: 20,
            http: this.uploadHttp,
            name: 'filepath',
            onError: this.uploadOnError,
            onSuccess: this.uploadOnSuccess,
            onStart: this.uploadOnStart,
            onQueue: this.uploadOnQueue,
            dropzoneId: this.dropzoneId,
            body: {
                noredirect: 1,
                block: this.block,
            },
        });
    },
    beforeDestroy() {
        this.$upload.off(this.uploadId);
    },
    methods: {
        prefixFile(attachment) {
            return this.block + '_' + attachment.name;
        },
        getUniqueId(attachment) {
            if(!attachment.uniqueId) {
                attachment.uniqueId = Vue.getUniqueId();
            }
            return attachment.uniqueId;
        },
        splitWordParts(text) {
            return text.split(/(\d+|[\][\s\\/\u2215\u2044'"*~#´`^°@<>|;:€§$%&=+_,.(){}?!-])/).filter(x => x !== "");
        },
        getIconFor(attachment) {
            let extension = /\.([^.]+)$/.exec(attachment.name);
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
        isPreviewAvailableFor(attachment) {
            return /\.(?:svg|png|gif|pdf|bmp|jpe?g)$/i.test(attachment.name);
        },
        getPreviewFor(attachment) {
            return this.$foswiki.getScriptUrl('rest', 'ImagePlugin', 'resize', {
                topic: this.internalWeb + '.' + this.internalTopic,
                file: attachment.name,
                size: `${tileSize}x${tileSize}^m`,
                crop: 'NorthWest',
            });
        },
        filterQueueFromAttachments(queue) {
            let filtered = this.internalAttachments;
            queue.forEach(item => {
                let name = this.prefixFile(item);
                let filteredName;
                if(this.attachmentNameFilterRegexp) {
                    filteredName = name.replace(this.attachmentNameFilterRegexp, '');
                }
                filtered = filtered.filter(attachment => {
                    return name !== attachment.name && filteredName !== attachment.name;
                });
            });
            if(this.internalAttachments.length !== filtered.length) {
                this.internalAttachments = filtered;
            }
            return true;
        },
        uploadOnQueue() {
            this.filterQueueFromAttachments(this.$upload.files(this.uploadId).queue);
            window.addEventListener("beforeunload", this.beforeUnloadHandler);
        },
        uploadOnStart() {
            this.filterQueueFromAttachments(this.$upload.files(this.uploadId).progress);
            window.addEventListener("beforeunload", this.beforeUnloadHandler);
        },
        uploadOnSuccess(file, res) {
            if(!(this.$upload.files(this.uploadId).progress.length || this.$upload.files(this.uploadId).queue.length)) {
                window.removeEventListener("beforeunload", this.beforeUnloadHandler);
            }

            let check = /^OK:\s(.*)\suploaded$/.exec(res.bodyText);
            if(!check) {
                check = new RegExp('^' + escapeRegExp(`OK: OopsException(attention/upload_name_changed web=>${this.web} topic=>${this.topic} params=>[${this.prefixFile(file)},`) + '(.*)\\]').exec(res.bodyText);
            }

            if(check && check[1].length) {
                let name = check[1];
                this.internalAttachments = this.internalAttachments.filter(attachment => attachment.name !== name);
                /* eslint-disable camelcase */ // metadata is usually not camelcase in foswiki
                this.internalAttachments.push({name, presented_name: file.name});
                /* eslint-enable camelcase */
            }
        },
        uploadOnError(file, error) {
            window.console.log('error', error, file);
            if(!(this.$upload.files(this.uploadId).progress.length || this.$upload.files(this.uploadId).queue.length)) {
                window.removeEventListener("beforeunload", this.beforeUnloadHandler);
            }

            let text = [this.$t('upload_error_start')];
            if(error) {
                let oops = /^ERROR: OopsException\(wlaplugin .* params=>\[(.*),(.*),'(.*)'\]/.exec(error.bodyText);
                if(oops) {
                    text.push(oops[2]);
                } else {
                    window.console.log('Error(s) while uploading ');
                    if( this.$upload.errors(this.uploadId).length) {
                        this.$upload.errors(this.uploadId).map((e) => {
                            window.console.log('Code: ', e.code, ' Msg: ', e.msg);
                            text.push(e.msg);
                        });
                    }
                }
            }
            if(file) {
                text.push(this.$t('upload_error_end', [file.name]));
            }
            let html = text.map(part => part.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')).join('<br><br>');

            let titleText = this.$t('upload_error_title');

            this.$showAlert({
                titleText,
                html,
                type: 'error',
                confirmButtonText: this.$t('ok'),
            }).then(this.$showAlert.noop).catch(this.$showAlert.noop);
        },
        uploadHttp(data) {
            return this.$getStrikeOneToken().then(validationKey => {
                if(validationKey) {
                    data.body.set('validation_key', validationKey);
                }

                let filepath = data.body.get('filepath');
                data.body.set('filename', this.prefixFile(filepath));
                data.body.set('presented_name', filepath.name);
                return this.post(data.url, data.body, {progress: data.progress}).then(data.success).catch(data.error);
            }).catch(this.uploadOnError);
        },
        post() {
            // Ok, admittedly this method is pointless, and when anybody has
            // the nerve to fix those spies in the tests, feel free to remove it
            return this.$http.post(...arguments);
        },
    },
};
</script>

<style lang="scss">
@import '../../sass/settings.scss';
$tile-size: 114px;

.vue-attachments,
.flatskin-wrapped .vue-attachments {
    flex-wrap: wrap;
    a, link {
        &, &:hover, &:visited, &:focus {
            text-decoration: none;
            color: $ma-body-text;
        }
    }
    .attachment-tile {
        color: $ma-dark-grey;
        background-color: $ma-light-grey;
        &.in-transit {
            background-color: $ma-button-grey;
        }
        width: $tile-size;
        height: $tile-size;
        border-radius: $ma-border-radius;
        line-height: 1.5rem;
        text-align: center;
        margin-left: map-get($spacings, xxxlarge);
        &:first-child {
            margin-left: 0;
        }
        position: relative;
        > .thumbnail,
        > img {
            border: 1px solid $ma-pale-grey;
            position: absolute;
            width: 100%;
            height: 100%;
            text-align: center;
            left: 0px;
            border-radius: $ma-border-radius;
            i {
                line-height: $tile-size;
            }
        }
        .queued {
            opacity: .5;
            background-color: blue;
        }
    }
    .attachment-label {
        width: $tile-size;
        overflow-wrap: break-word;
        word-wrap: break-word;
        margin-top: map-get($spacings, small);
    }
    .upload-label {
        color: $ma-dark-grey;
        cursor: pointer;
        text-align: center;
    }
    .progress-bar {
        margin-left: map-get($spacings, small);
        margin-right: map-get($spacings, small);
        position: relative;
        top: calc((#{$tile-size} - #{map-get($spacings, medium)}) / 2);
        border: 1px solid $ma-light-grey;
        border-radius: $ma-border-radius;
        height: map-get($spacings, medium);
        .meter {
            background-color: $ma-primary;
            border-radius: $ma-border-radius;
            height: calc(#{map-get($spacings, medium)} - 2px);
        }
    }
    .upload-box {
        cursor: pointer;
        padding-left: map-get($spacings, small);
        padding-right: map-get($spacings, small);
        > * {
            height: calc(#{$tile-size} / 2);
            line-height: initial;
        }
        .upload-icon {
            display: flex;
            flex-direction: column;
            i {
                margin-top: auto;
            }
        }
    }
    .dropzone-wrapper {
        position: relative;
        .dropzone-overlay {
            $border-width: 2px;
            position: absolute;
            width: calc(100% - 2*#{map-get($spacings, medium)} - 2*#{$border-width} );
            height: calc(100% - 2*#{map-get($spacings, medium)} - 2*#{$border-width});
            border: $border-width dashed $ma-light-grey;
            border-radius: $ma-border-radius;
            background-color: rgba(255, 255, 255, 0.9);
            z-index: 100;
            margin: map-get($spacings, medium);
            margin-left: map-get($spacings, medium) + $border-width;
            display: flex;
            justify-content: center;
            align-items: center;
            display: none;

            p {
                color: $ma-dark-grey;
                text-align: center;
                font-size: 33px;
                line-height: 45px;
                i {
                    font-size: 64px;
                    line-height: 64px;
                }
            }

            &.dropzone-overlay--active {
                display: flex;
            }
        }

        &.dropzone-drag-active {
            .dropzone-overlay{
                display: flex;
            }
        }
    }
}

</style>
