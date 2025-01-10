import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const MODE = process.env.NODE_ENV;

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    cssMinify: MODE === "production",
  },
  plugins: [
    remix({
      serverModuleFormat: "esm",
      ignoredRouteFiles: ["**/.*", "**/*.test.{ts,tsx}"],
      future: {
        unstable_optimizeDeps: true,
      },
    }),
    tsconfigPaths(),
  ],
});
