describe('Overview page', () => {
  beforeEach((done) => {
    const request = window.indexedDB.deleteDatabase('PaintingDatabase');
    request.onsuccess = () => done();
  });

  it('click on new painting and back and delete one', () => {
    cy.visit('/').then(() => {
      cy.get('paint-app').as('paintApp');
      cy.get('@paintApp')
        .should('be.visible')
        .and('have.attr', 'ready', 'ready');

      cy.get('@paintApp').within(() => {
        cy.get('paint-overview-page').as('overviewPage');
        cy.get('@overviewPage').should('be.visible');

        cy.get('@overviewPage').find('.painting').as('paintings');
        cy.get('@paintings').then(($paintings) => {
          cy.wrap($paintings).should('be.length', 1).first().click();
          cy.url().should('match', /paint\/1$/);
          cy.get('@paintApp').find('.back-button').as('backButton');
          cy.get('@paintApp').find('paint-area').should('be.visible');
          cy.get('@backButton').should('be.length', 1).click();
          cy.get('@paintings').should('be.length', 2);
          cy.get('@overviewPage').then(($overviewPage) => {
            cy.wrap($overviewPage)
              .find('.delete[role="button"]')
              .first()
              .click();
            cy.get('@paintings').should('be.length', 1);
          });
        });
      });
    });
  });
});
