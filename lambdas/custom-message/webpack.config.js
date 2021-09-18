const path = require('path');
const PACKAGE = require('./package.json');
const name = PACKAGE.name;
const version = PACKAGE.version;
const ZipPlugin = require('zip-webpack-plugin');

module.exports = () => {
    return {
        context: path.join(__dirname, "dist"),
        mode: 'production',
        entry: "./index.js",
        optimization: {
            minimize: false
        },
        performance: {
            hints: false
        },
        output: {
            libraryTarget: 'commonjs',
            path: path.join(__dirname, 'webpack'),
            filename: 'index.js',
        },
        target: 'node',
        plugins: [
            new ZipPlugin({
                filename: `${name}@${version}.zip`
            })
        ]
    }
};