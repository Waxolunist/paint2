describe('Overview page', () => {
  const getOverviewPage = () =>
    cy
      .get('paint-app')
      .shadow()
      .find('lit-route[component="paint-overview-page"]')
      .shadow()
      .find('paint-overview-page')
      .shadow();

  it('tests start page', function () {
    cy.visit('/');
    getOverviewPage().find('paint-new-paint-button').should('be.length', 1);
  });
});
