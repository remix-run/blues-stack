import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const MODE = process.env.NODE_ENV;

export default defineConfig({
  build: {
    cssMinify: MODE === "production",
  },
  plugins: [
    remix({
      serverModuleFormat: "esm",
      ignoredRouteFiles: ["**/.*", "**/*.test.{ts,tsx}"],
      future: {
        unstable_optimizeDeps: true,
        v3_fetcherPersist: true,
        v3_lazyRouteDiscovery: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
});
