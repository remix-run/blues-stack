const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  FORCE_COLOR: "1",
};
module.exports = {
  apps: [
    {
      name: "Server",
      script: [
        "node",
        "--inspect",
        "--require ./node_modules/dotenv/config",
        "--require ./mocks",
        "./build/server.js",
      ]
        .filter(Boolean)
        .join(" "),
      watch: ["./mocks/**/*.ts", "./build/server.js", "./.env"],
      env,
    },
    {
      name: "Server Build",
      script: "npm run build:server -- --watch",
      ignore_watch: ["."],
      env,
    },
    {
      name: "Remix",
      script: "cross-env NODE_ENV=development remix watch",
      ignore_watch: ["."],
      env,
    },
    {
      name: "Tailwind",
      script: "npm run generate:css -- --watch",
      autorestart: false,
      ignore_watch: ["."],
      env,
    },
  ],
};
