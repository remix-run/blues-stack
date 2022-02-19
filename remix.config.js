/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  cacheDirectory: "./node_modules/.cache/remix",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "build",
  devServerPort: 8002,
  ignoredRouteFiles: [".*"],

  // this is for defining test-only routes
  // these will only be available in the app when ENABLE_TEST_ROUTES is true
  routes(defineRoutes) {
    return defineRoutes((route) => {
      if (process.env.ENABLE_TEST_ROUTES === "true") {
        if (process.env.FLY_APP_NAME) {
          console.warn(
            `🚨 🚨 🚨 🚨 ENABLE_TEST_ROUTES is true, FLY_APP_NAME is set to ${process.env.FLY_APP_NAME} so we're not going to enable test routes because this is probably a mistake. We do NOT want test routes enabled on Fly (production). 🚨 🚨 🚨 🚨 🚨`
          );
          return;
        }
        route("__tests/login", "__test_routes__/login.tsx");
      }
    });
  },
};
