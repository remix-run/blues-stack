const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const toml = require("@iarna/toml");

function escapeRegExp(string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getRandomString(length) {
  return crypto.randomBytes(length).toString("hex");
}

async function main() {
  const README_PATH = path.join(__dirname, "README.md");
  const FLY_TOML_PROD_PATH = path.join(__dirname, "fly.production.toml");
  const FLY_TOML_STAGING_PATH = path.join(__dirname, "fly.staging.toml");
  const EXAMPLE_ENV_PATH = path.join(__dirname, ".env.example");
  const ENV_PATH = path.join(__dirname, ".env");

  const REPLACER = "fly-stack-template-app-name";

  const DIR_NAME = path.basename(path.resolve(__dirname));
  const SUFFIX = getRandomString(2);
  const APP_NAME = DIR_NAME + "-" + SUFFIX;

  const [prodContent, stagingContent, readme, env] = await Promise.all([
    fs.readFile(FLY_TOML_PROD_PATH, "utf-8"),
    fs.readFile(FLY_TOML_STAGING_PATH, "utf-8"),
    fs.readFile(README_PATH, "utf-8"),
    fs.readFile(EXAMPLE_ENV_PATH, "utf-8"),
  ]);

  const newEnv = env + `\nSESSION_SECRET="${getRandomString(16)}"`;

  const prodToml = toml.parse(prodContent);
  const stagingToml = toml.parse(stagingContent);
  prodToml.app = prodToml.app.replace(REPLACER, APP_NAME);
  stagingToml.app = stagingToml.app.replace(REPLACER, APP_NAME);

  const newReadme = readme.replace(
    new RegExp(escapeRegExp(REPLACER), "g"),
    APP_NAME
  );

  await Promise.all([
    fs.writeFile(FLY_TOML_PROD_PATH, toml.stringify(prodToml)),
    fs.writeFile(FLY_TOML_STAGING_PATH, toml.stringify(stagingToml)),
    fs.writeFile(README_PATH, newReadme),
    fs.writeFile(ENV_PATH, newEnv),
  ]);
}

void main();
