const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.join(__dirname, '../dist-chrome/app'),
        filename: '[name].js',
    },
    plugins: [
        // Copy manifest
        new CopyPlugin([{ from: './manifest-chrome.json', to: '../manifest.json' }], {
            context: 'src/manifest',
        }),
    ],
});