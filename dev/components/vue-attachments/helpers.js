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

export {
    tileSize,
    thumbnailGeneric,
    thumbnails,
}

