export default function ({ setGenerator }) {
  setGenerator("airtable-crud", {
    description: "Creates a CRUD model for your data",
    prompts: [
      {
        type: "input",
        name: "airtableTableName",
        message: "What is your table name (plural, ie Players, Fields, Games)",
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "app/routes",
        templateFiles: "plop-templates/airtable-crud/**/*.hbs",
        base: "plop-templates/airtable-crud",
        force: true,
      },
      {
        type: "append",
        path: "app/components/Navbar.tsx",
        pattern: `{/* PLOP MARKER - DO NOT DELETE */}`,
        templateFile: "plop-templates/navbar-link/link.hbs",
      },
    ],
  });
}
