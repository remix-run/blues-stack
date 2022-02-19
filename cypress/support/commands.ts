import faker from "@faker-js/faker";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Logs in with a random user. Yields the user and adds an alias to the user
       *
       * @returns {typeof login}
       * @memberof Chainable
       * @example
       *    cy.login()
       * @example
       *    cy.login({ email: 'whatever@example.com' })
       */
      login: typeof login;
    }
  }
}

function login({
  email = faker.internet.email(undefined, undefined, "example.com"),
}: {
  email?: string;
} = {}) {
  const query = new URLSearchParams();
  query.set("email", email);
  cy.then(() => ({ email })).as("user");
  cy.visit(`/__tests/login?${query.toString()}`);
  return cy.get("@user");
}

Cypress.Commands.add("login", login);

/*
eslint
  @typescript-eslint/no-namespace: "off",
*/
