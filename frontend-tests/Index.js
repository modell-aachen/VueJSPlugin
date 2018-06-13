import "babel-polyfill";
let req = require.context('.', true, /.*Spec\.js$/m);
req.keys().forEach(function(key){
                    req(key);
});
