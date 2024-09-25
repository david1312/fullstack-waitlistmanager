/// <reference types="cypress" />

describe('Form Validation Functionality', () => {
  beforeEach(function () {
    // Load the fixture with messages and alias it
    cy.fixture('messages.json').as('messages');
    cy.visit('http://localhost:5173');
  });

  it('should display the form and all required elements', () => {
    // Check if the form container and its inputs exist
    cy.get('[data-test="input-name"]').should('exist'); // Name input
    cy.get('[data-test="input-size"]').should('exist'); // Party size input
    cy.get('[data-test="button-join-waitlist"]').should('exist'); // Join button

    // Additional checks for labels and form
    cy.get('form').should('exist');
    cy.get('label[for="name"]').should('exist');
    cy.get('label[for="partySize"]').should('exist');
  });

  it('should show validation errors for empty fields', function () {
    // Click the join button without entering any data
    cy.get('[data-test="button-join-waitlist"]').click();

    // Check for error messages using data from fixture
    cy.get('[data-test="error-name"]')
      .should('be.visible')
      .and('contain', this.messages.nameError);

    cy.get('[data-test="error-size"]')
      .should('be.visible')
      .and('contain', this.messages.partySizeError);
  });

  it('should show error for invalid party size (e.g., -1 and 11)', function () {
    // Enter a valid name
    cy.get('[data-test="input-name"]').type('David');

    // Test for party size less than the minimum required
    cy.get('[data-test="input-size"]').clear().type('-1');
    cy.get('[data-test="button-join-waitlist"]').click();
    cy.get('[data-test="error-size"]')
      .should('be.visible')
      .and('contain', this.messages.partySizeError);

    // Test for party size greater than the maximum allowed
    cy.get('[data-test="input-size"]').clear().type('11');
    cy.get('[data-test="button-join-waitlist"]').click();
    cy.get('[data-test="error-size"]')
      .should('be.visible')
      .and('contain', this.messages.partySizeError);
  });

  it('should submit the form with valid inputs', function () {
    // Input valid value
    cy.get('[data-test="input-name"]').type('David');
    cy.get('[data-test="input-size"]').clear().type('1');
    cy.get('[data-test="button-join-waitlist"]').click();

    // For example, if the form clears or shows a success message:
    cy.get('[data-test="text-welcome"]').should('exist');
  });
});
