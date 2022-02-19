import faker from "@faker-js/faker";

describe("smoke tests", () => {
  it("should allow you to register and login", () => {
    const loginForm = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    cy.visit("/");
    cy.findByRole("link", { name: /sign up/i }).click();
    cy.findByRole("heading", { name: /join/i });

    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /join/i }).click();

    cy.findByRole("button", { name: /logout/i }).click();
    cy.findByRole("heading", { name: /sign in/i });
  });

  it("should allow you to make a note", () => {
    const testNote = {
      title: faker.lorem.words(1),
      body: faker.lorem.sentences(1),
    };
    cy.login().then((u) => console.log(u));

    cy.findByText("No notes yet");

    cy.findByRole("textbox", { name: /title/i }).type(testNote.title);
    cy.findByRole("textbox", { name: /body/i }).type(testNote.body);
    cy.findByRole("button", { name: /save/i }).click();

    cy.findByRole("listitem").within(() => {
      cy.findByRole("button", { name: /delete/i }).click();
    });

    cy.findByText("No notes yet");
  });
});
