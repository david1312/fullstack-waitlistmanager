/// <reference types="cypress" />

describe('Diner Checkin', () => {
  beforeEach(function () {
    cy.fixture('messages.json').as('messages');
    cy.visit('http://localhost:5173');
  });

  it('should submit the form with valid inputs', function () {
    // check element
    cy.get('[data-test="input-name"]').should('exist'); // Name input
    cy.get('[data-test="input-size"]').should('exist'); // Party size input
    cy.get('[data-test="button-join-waitlist"]').should('exist'); // Join button

    // Input valid value
    cy.get('[data-test="input-name"]').type('David');
    cy.get('[data-test="input-size"]').clear().type('1');
    cy.get('[data-test="button-join-waitlist"]').click();

    // Check element
    cy.get('[data-test="toast"]')
      .should('be.visible')
      .and('contain', this.messages.checkinTurn);
    cy.get('[data-test="text-welcome"]').should('exist');
    cy.get('[data-test="button-leave-waitlist"]').should('exist');
    cy.get('[data-test="button-checkin"]').should('exist').should('be.enabled');

    // Diner Checkin
    cy.get('[data-test="button-checkin"]').click();
    cy.get('[data-test="modal-success-checkin"]').should('exist');
    cy.get('[data-test="text-success-checkin"]').should('exist');
    cy.get('[data-test="gif-success"]').should('exist');

    cy.get('[data-test="button-close-modal"]')
      .should('exist')
      .should('be.enabled')
      .click();

    // validate component after exit
    cy.get('[data-test="input-name"]').should('exist'); // Name input
    cy.get('[data-test="input-size"]').should('exist'); // Party size input
    cy.get('[data-test="button-join-waitlist"]').should('exist'); // Join button
  });
});
