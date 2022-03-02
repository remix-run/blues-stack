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
      env: {
        NODE_ENV: process.env.NODE_ENV ?? "development",
        FORCE_COLOR: "1",
      },
    },
    {
      name: "Remix",
      script: "remix watch",
      ignore_watch: ["."],
      env: {
        NODE_ENV: process.env.NODE_ENV ?? "development",
        FORCE_COLOR: "1",
      },
    },
  ],
};
