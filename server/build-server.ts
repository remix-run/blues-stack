import path from "node:path";
import { fileURLToPath } from "node:url";

import esbuild from "esbuild";
import fsExtra from "fs-extra";

const pkg = fsExtra.readJsonSync(path.join(process.cwd(), "package.json"));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const here = (...s: string[]) => path.join(__dirname, ...s);

console.log();
console.log("building...");

esbuild
  .build({
    // note that we are not including dev-server.js since it's only used for development
    entryPoints: [here("index.ts")],
    outdir: here("../server-build"),
    target: [`node${pkg.engines.node}`],
    platform: "node",
    sourcemap: true,
    format: "esm",
    logLevel: "info",
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
