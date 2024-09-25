/// <reference types="cypress" />

describe('Diner Leaving', () => {
  beforeEach(function () {
    cy.fixture('messages.json').as('messages');
    cy.visit('http://localhost:5173');
  });

  it('should user be able to leave the queue, and test functionality cancel and confirm leave button', function () {
    // check element
    cy.get('[data-test="input-name"]').should('exist'); // Name input
    cy.get('[data-test="input-size"]').should('exist'); // Party size input
    cy.get('[data-test="button-join-waitlist"]').should('exist'); // Join button

    // Input valid value
    cy.get('[data-test="input-name"]').type('David');
    cy.get('[data-test="input-size"]').clear().type('1');
    cy.get('[data-test="button-join-waitlist"]').click();

    // Check element
    cy.get('[data-test="text-welcome"]').should('exist');
    cy.get('[data-test="button-leave-waitlist"]').should('exist');
    cy.get('[data-test="button-checkin"]').should('exist').should('be.enabled');

    // Diner click cutton leave waitlist then cancel
    cy.get('[data-test="button-leave-waitlist"]').click();
    cy.get('[data-test="text-modal-confirm"]').should('exist');
    cy.get('[data-test="button-confirm-leave"]')
      .should('exist')
      .should('be.enabled');
    cy.get('[data-test="button-cancel-leave"]')
      .should('exist')
      .should('be.enabled')
      .click();

    // Recheck element
    cy.get('[data-test="text-welcome"]').should('exist');
    cy.get('[data-test="button-leave-waitlist"]').should('exist');
    cy.get('[data-test="button-checkin"]').should('exist').should('be.enabled');

    // Diner click cutton leave waitlist then confirm
    cy.get('[data-test="button-leave-waitlist"]').click();
    cy.get('[data-test="text-modal-confirm"]').should('exist');
    cy.get('[data-test="button-cancel-leave"]')
      .should('exist')
      .should('be.enabled');
    cy.get('[data-test="button-confirm-leave"]')
      .should('exist')
      .should('be.enabled')
      .click();

    // validate component after exit
    cy.get('[data-test="input-name"]').should('exist'); // Name input
    cy.get('[data-test="input-size"]').should('exist'); // Party size input
    cy.get('[data-test="button-join-waitlist"]').should('exist'); // Join button
  });
});
