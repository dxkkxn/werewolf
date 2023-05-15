describe('creating a new game', () => {
  it('passes', () => {
    cy.visit('http://localhost:19006/')
    // user already created
    // connecting
    cy.get('[placeholder="Identifiant"]').clear()
    cy.get('[placeholder="Identifiant"]').type("cypress")
    cy.get('[placeholder="Mot De Passe"]').clear()
    cy.get('[placeholder="Mot De Passe"]').type("Robin777@")
    cy.contains('Déjà inscrit ? Se connecter').click()
    cy.contains('Connexion').click()
    // create game
    cy.contains('Créer une partie').click()
    cy.get('input:visible').eq(0).type('5-12')
    cy.get('input:visible').eq(1).type('4')
    cy.get('input:visible').eq(2).type('3')
    cy.get('input:visible').eq(3).type('0')
    cy.get('input:visible').eq(4).type('8')
    //cy.get('input').eq(5).type();
    cy.get('input:visible').eq(6).type('1')
    cy.get('input:visible').eq(7).type('0.5')
    cy.get('input:visible').eq(8).type('0.3')
    cy.get('input:visible').eq(9).type('0.3')
    cy.contains('Créer la partie').click()
    // on est redirigé vers la salle d'attente avec un bouton start
  })
})
