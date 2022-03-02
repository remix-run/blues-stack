const path = require("path");

/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  cacheDirectory: "./node_modules/.cache/remix",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  server: "./server.ts",
  serverBuildPath: "./build/server.js",
  serverBuildDirectory: "build",
  ignoredRouteFiles: [".*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  routes(defineRoutes) {
    return defineRoutes((route) => {
      if (process.env.ENABLE_TEST_ROUTES === "true") {
        if (process.env.NODE_ENV === "production") {
          console.warn(
            `🚨 🚨 🚨 🚨 ENABLE_TEST_ROUTES is true and NODE_ENV is "production" so we're not going to enable test routes because this is probably a mistake. We do NOT want test routes enabled in production. 🚨 🚨 🚨 🚨 🚨`
          );
          return;
        }
        route(
          "__tests/create-user",
          path.join(__dirname, "cypress/support/test-routes/create-user.ts")
        );
        route(
          "__tests/delete-user",
          path.join(__dirname, "cypress/support/test-routes/delete-user.ts")
        );
      }
    });
  },
};
