var webpack = require("webpack");
var config = {};
const path = require("path");

function generateConfig(name) {
  var uglify = name.indexOf("min") > -1;

  var config = {
    entry: ["regenerator-runtime/runtime.js", "./index.js"],
    target: "web",
    // resolve: {
    //     fallback: {
    //       "fs": false,
    //       "tls": false,
    //       "net": false,
    //       "path": false,
    //       "zlib": false,
    //       "http": false,
    //       "https": false,
    //       "stream": false,
    //       "crypto": false,
    //       "crypto-browserify":false,
    //       "util": require.resolve("util/")
    //     }
    //   },
    output: {
      path: path.resolve(__dirname, "dist/"),
      filename: name + ".js",
      sourceMapFilename: name + ".map",
      globalObject: "this",

      library: {
        name: "deepai",
        type: "umd",
        // umdNamedDefine: true, // Important
        // export: "default",
      },
    },
    node: {},
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.js?$/, // include .js files
          enforce: "pre", // preload the jshint loader
          exclude: /(node_modules)/, // exclude any and all files in the node_modules folder
          use: [
            {
              loader: "babel-loader",
              // more options in the optional jshint object
              options: {},
            },
          ],
        },
      ],
    },
    optimization: {
      // We no not want to minimize our code.
      minimize: uglify,
    },
  };

  config.plugins = [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
  ];
  //
  //    if (uglify) {
  //        config.plugins.push(
  //        new UglifyJsPlugin({
  //            uglifyOptions: {
  //                warnings: true,
  //                ie8: true,
  //                mangle:false,
  //                output: {
  //                    comments: false
  //                }
  //                }
  //            })
  //        );
  //    }

  config.mode = "production";

  return config;
}

["deepai", "deepai.min"].forEach(function (key) {
  config[key] = generateConfig(key);
});

module.exports = config;
