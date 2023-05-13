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
    expect(cy.get('TouchableOpacityi:visible')).to.have.lengthOf(1)
    cy.get('Touchable Opacity:visible').click()
    cy.contains("Salle d'attente de la partie 1")
  })
})
