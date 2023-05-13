describe('Inscription', () => {
  it('passes', () => {
    cy.visit('http://localhost:19006/')
    // creating user
    cy.get('[placeholder="Identifiant"]').type("cypress")
    cy.get('[placeholder="Mot De Passe"]').type("Robin777@")
    cy.get('[placeholder="Confirmer mot de passe"]').type("Robin777@")
    cy.contains('Créer un compte').click()
    cy.get('img').last().click()
    cy.contains('Continuer').click()
    cy.contains('Bonjour cypress')

    // try creating same user => TODO disconnect
    cy.visit('http://localhost:19006/')
    cy.get('[placeholder="Identifiant"]').type("cypress")
    cy.get('[placeholder="Mot De Passe"]').type("Robin777@")
    cy.get('[placeholder="Confirmer mot de passe"]').type("Robin777@")
    cy.contains('Créer un compte').click()
    cy.get('img').last().click()
    cy.contains('Continuer').click()
    // verifie qu'on est sur l'écran d'inscription
    cy.get('[placeholder="Confirmer mot de passe"]')
  })
})
