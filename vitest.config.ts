/// <reference types="vitest" />
/// <reference types="vite/client" />

import { configDefults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths({ projects: ["tsconfig.json"]})],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup-test-env.ts"],
    include: ["./app/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: [
      "node_modules",
      "dist",
      ".idea",
      ".git",
      ".cache",
      "build",
      "postgres-data"
    ],
    watchIgnore: [
      ".*\\/node_modules\\/.*",
      ".*\\/build\\/.*",
      ".*\\/postgres-data\\/.*",
    ],
  },
});
