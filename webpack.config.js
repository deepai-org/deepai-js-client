var webpack = require('webpack');
var config = {};

function generateConfig(name) {
    var uglify = name.indexOf('min') > -1;
    var config = {
        entry: ['babel-polyfill','./index.js'],
        output: {
            path: 'dist/',
            filename: name + '.js',
            sourceMapFilename: name + '.map',
            library: 'deepai',
            libraryTarget: 'umd'
        },
        node: {
            process: false
        },
        devtool: 'source-map',
        module: {
            loaders: [{
                test: /\.js?$/,
                exclude: /(node_modules)/,
                loader: 'babel'
            }]
        }
    };

    config.plugins = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ];

    if (uglify) {
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compressor: {
                    warnings: false
                }
            })
        );
    }

    return config;
}

['deepai', 'deepai.min'].forEach(function (key) {
    config[key] = generateConfig(key);
});

module.exports = config;
