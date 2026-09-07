const withOptimizedClassnames = require("next-optimized-classnames");

const withPlugins = require("next-compose-plugins");

const finalConfig = withPlugins([[withOptimizedClassnames]], {
  pageExtensions: ["tsx"],
  trailingSlash: true,
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
    ROOT_DOMAIN: "ddr.stepcharts.com",
  },
  output: "export",
});

module.exports = finalConfig;
