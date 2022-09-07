export default function ({ setGenerator }) {
  setGenerator("airtable-crud", {
    description: "Creates a CRUD model for your data",
    prompts: [
      {
        type: "confirm",
        name: "hasSetEnvVariables",
        message: "Have you set up your .env file with Airtable credentials",
      },
      {
        type: "confirm",
        name: "shouldCreateEnv",
        message: "Create .env file",
        when: (answers) => !answers.hasSetEnvVariables,
      },
      {
        type: "input",
        name: "airtableApiKey",
        message: "What is your Airtable API key (https://airtable.com/account)",
        when: (answers) => answers.shouldCreateEnv,
      },
      {
        type: "input",
        name: "airtableBaseId",
        message: "What is your Airtable base ID",
        when: (answers) => answers.hasSetEnvVariables,
      },
      {
        type: "input",
        name: "airtableTableName",
        message: "What is your table name (plural, ie Players, Fields, Games)",
        when: (answers) => answers.airtableBaseId,
      },
    ],
    actions: [
      {
        type: "add",
        path: `${process.cwd()}/.env`,
        templateFile: "plop-templates/env/.env.hbs",
        skip: (answers) => {
          if (!answers.shouldCreateEnv) {
            return "Using existing .env file";
          }
        },
      },
      {
        type: "addMany",
        destination: "app/routes",
        templateFiles: "plop-templates/airtable-crud/**/*.hbs",
        base: "plop-templates/airtable-crud",
        skip: (answers) => {
          if (!answers.hasSetEnvVariables) {
            return "Please create an .env file with your credentials before running CRUD action files.";
          }
        },
      },
      {
        type: "add",
        path: "app/services/airtable.server.ts",
        templateFile: "plop-templates/airtable-service/airtable.server.ts.hbs",
        skip: (answers) => {
          if (!answers.hasSetEnvVariables) {
            return "Please create an .env file with your credentials before adding Airtable service file.";
          }
        },
      },
    ],
  });
}
