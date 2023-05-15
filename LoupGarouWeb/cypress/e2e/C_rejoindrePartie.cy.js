import { screen, configure } from '@testing-library/react'
describe('joining a game', () => {
  it('passes', () => {
    cy.visit('http://localhost:19006/')
    // creating 2nd user
    cy.get('[placeholder="Identifiant"]').type("cypress2")
    cy.get('[placeholder="Mot De Passe"]').type("Robin777@")
    cy.get('[placeholder="Confirmer mot de passe"]').type("Robin777@")
    cy.contains('Créer un compte').click()
    cy.get('img').last().click()
    cy.contains('Continuer').click()
    // joining
    cy.contains('Consulter les parties').click()
    // assert only one game
    expect(screen.getByTestId('0')).toBeDefined();
    expect(screen.getByTestId('1')).toBeDefined();
    cy.get('[data-test-id="0"]')
    // check parameters are displayed correctly
    cy.contains('Créée par cypress')
    cy.contains('De 2 à 12 joueurs')
    cy.contains('Jour: 4 min, Nuit: 3 min')
    cy.contains('C: 0, I: 1, V: 0.5, S: 0.3')
    cy.contains('Proportion de loups : 0.3')
    cy.contains('Joueurs actuels : 1')
    cy.contains("Salle d'attente de la partie 1")
  })
})
