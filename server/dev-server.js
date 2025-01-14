import { execa } from "execa";

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === "production") {
  await import("../server-build/index.js");
} else {
  const command =
    'tsx watch --clear-screen=false --ignore ".cache/**" --ignore "app/**" --ignore "vite.config.ts.timestamp-*" --ignore "build/**" --ignore "node_modules/**" --inspect ./index.js';
  execa(command, {
    stdio: ["ignore", "inherit", "inherit"],
    shell: true,
    env: {
      FORCE_COLOR: true,
      MOCKS: true,
      // eslint-disable-next-line no-undef
      ...process.env,
    },
    // https://github.com/sindresorhus/execa/issues/433
    windowsHide: false,
  });
}
