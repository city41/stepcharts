const withOptimizedImages = require("next-optimized-images");
const withOptimizedClassnames = require("next-optimized-classnames");

const config = {
  pageExtensions: ["tsx"],
  trailingSlash: true,
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
    ROOT_DOMAIN: "ddr.stepcharts.com",
  },
};

const finalConfig = (_phase, { defaultConfig }) => {
  const plugins = [withOptimizedImages, withOptimizedClassnames];
  return plugins.reduce(
    (acc, plugin) => {
      return plugin(acc);
    },
    { ...defaultConfig, ...config }
  );
};

console.log(JSON.stringify(finalConfig, null, 2));

return finalConfig;
