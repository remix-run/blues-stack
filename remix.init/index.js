const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

function getRandomString(length) {
  return crypto.randomBytes(length).toString("hex");
}

async function main({ rootDirectory }) {
  const APP_NAME = path.basename(rootDirectory);
  const APP_ID = (APP_NAME + "-" + getRandomString(2))
    // get rid of anything that's not allowed in an app name
    .replace(/[^a-zA-Z0-9-_]/g, "-");

  // copy files
  const filesToCopy = [["remix.init/gitignore", ".gitignore"]];
  for (const [from, to] of filesToCopy) {
    await fs.copyFile(
      path.join(rootDirectory, from),
      path.join(rootDirectory, to)
    );
  }

  // update env to have SESSION_SECRET
  const EXAMPLE_ENV_PATH = path.join(rootDirectory, ".env.example");
  const ENV_PATH = path.join(rootDirectory, ".env");
  const env = await fs.readFile(EXAMPLE_ENV_PATH, "utf-8");
  const newEnv = env.replace(
    /^SESSION_SECRET=.*$/m,
    `SESSION_SECRET="${getRandomString(16)}"`
  );
  await fs.writeFile(ENV_PATH, newEnv);

  // delete files only needed for the template
  const filesToDelete = [
    ".github/ISSUE_TEMPLATE",
    ".github/PULL_REQUEST_TEMPLATE.md",
  ];
  for (const file of filesToDelete) {
    await fs.rm(path.join(rootDirectory, file), { recursive: true });
  }

  // replace "blues-stack-template" in all files with the app name
  const filesToReplaceIn = [
    "README.md",
    "package.json",
    "fly.toml",
    "project.json",
    "nx.json",
  ];
  for (const file of filesToReplaceIn) {
    const filePath = path.join(rootDirectory, file);
    const contents = await fs.readFile(filePath, "utf-8");
    const newContents = contents.replace(/blues-stack-template/g, APP_ID);
    await fs.writeFile(filePath, newContents);
  }

  console.log(
    `
Setup is almost complete. Follow these steps to finish initialization:

- Start the database:
  npm run docker

- Run setup (this updates the database):
  npm run setup

- Run the first build (this generates the server you will run):
  npm run build

- You're now ready to rock and roll 🤘
  npm run dev
    `.trim()
  );
}

module.exports = main;
