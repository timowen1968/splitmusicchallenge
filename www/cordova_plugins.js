alert("../www/cordova_plugins.js");
cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cc.fovea.cordova.purchase.InAppPurchase",
        "file": "plugins/cc.fovea.cordova.purchase/www/store-ios.js",
        "pluginId": "cc.fovea.cordova.purchase",
        "clobbers": [
            "store"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.2",
    "cc.fovea.cordova.purchase": "6.0.0"
};
// BOTTOM OF METADATA
});
