const withPlugins = require("next-compose-plugins");

const withOptimizedImages = require("next-optimized-images");

module.exports = withPlugins(
  [
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
