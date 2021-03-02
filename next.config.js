const withPlugins = require("next-compose-plugins");
const withOptimizedImages = require("next-optimized-images");
const withOptimizedClassnames = require("next-optimized-classnames");

module.exports = withPlugins(
  [
    withOptimizedClassnames,
    [
      withOptimizedImages,
      {
        inlineImageLimit: -1,
      },
    ],
  ],
  {
    pageExtensions: ["tsx"],
    trailingSlash: true,
    serverRuntimeConfig: {
      PROJECT_ROOT: __dirname,
      ROOT_DOMAIN: "ddr.stepcharts.com",
    },
  }
);
