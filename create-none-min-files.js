/*
 * This is only to support legacy code
 * or wrong configure plugins.
 *
 * Webpack will generate only minified versions
 * including a source-map. However, some of our plugins
 * rely on the "unminified" version of css/js files.
 * For now we'll fake those "unminified" version
 */

var fs = require('fs');
const path = require('path');
const destDir = path.join(__dirname, 'pub/System/FlatSkin');

const fileCopyMap = [
    { from: 'css/flatskin.min.css', to: 'css/flatskin.css' },
    { from: 'css/flatskin_wrapped.min.css', to: 'css/flatskin_wrapped.css' },
    { from: 'js/flatskin.min.js', to: 'js/flatskin.js' },
    { from: 'js/foundation.min.js', to: 'js/foundation.js' },
]

for( let f of fileCopyMap ) {
    fs.createReadStream( path.join(destDir, f.from) ).pipe(fs.createWriteStream( path.join(destDir, f.to ) ));
}

