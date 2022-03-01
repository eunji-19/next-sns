/**
 * hidden-soruce-map
 * - 안하면 배포하고 react 소스코드 드러남
 */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  distDir: ".next",
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === "production";
    const plugins = [
      ...config.plugins,
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
    ];
    return {
      ...config,
      mode: prod ? "production" : "ddevelopment",
      devtool: prod ? "hidden-source-map" : "eval",
      plugins,
    };
  },
});
