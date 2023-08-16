module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable source maps for production builds
      if (process.env.NODE_ENV === "production") {
        webpackConfig.devtool = false;
      }

      // Handle source maps for the problematic package
      webpackConfig.module.rules.push({
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
        exclude: [/node_modules\/@excalidraw\/excalidraw\//i],
      });

      return webpackConfig;
    },
  },
};
