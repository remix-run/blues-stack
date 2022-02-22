/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  cacheDirectory: "./node_modules/.cache/remix",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "build",
  ignoredRouteFiles: [".*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],

  // This is for defining test-only routes.
  // These will only be available in the app when ENABLE_TEST_ROUTES is true
  routes(defineRoutes) {
    return defineRoutes((route) => {
      if (process.env.ENABLE_TEST_ROUTES === "true") {
        route("__tests/login", "__test_routes__/login.tsx");
      }
    });
  },
};
