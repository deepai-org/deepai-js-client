var webpack = require("webpack");
const path = require("path");

function generateConfig(name, target) {
    var uglify = name.indexOf("min") > -1;
  
    var config = {
        entry: ["regenerator-runtime/runtime.js", "./index.js"],
        target: target,
        output: {
            path: path.resolve(__dirname, "dist/"),
            filename: name + ".js",
            sourceMapFilename: name + ".map",
            globalObject: "this",
            library: {
                name: "deepai",
                type: "umd",
            },
        },
        node: {},
        devtool: "source-map",
        module: {
            rules: [
                {
                    test: /\.js?$/,
                    enforce: "pre",
                    exclude: /(node_modules)/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {},
                        },
                    ],
                },
            ],
        },
        optimization: {
            minimize: uglify,
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            }),
        ],
        mode: "production",
    };
  
    return config;
}

const configurations = [];

["deepai", "deepai.min"].forEach(function(key) {
    configurations.push(generateConfig(key, 'web'));   // Browser version
    configurations.push(generateConfig(key + '.node', 'node'));   // Node.js version
});

module.exports = configurations;
