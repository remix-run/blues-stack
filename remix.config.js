/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  server: "./server.ts",
  serverBuildPath: "./build/server.js",
  ignoredRouteFiles: [".*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
};
