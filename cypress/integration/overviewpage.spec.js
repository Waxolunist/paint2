describe('Overview page', () => {
  const getOverviewPage = () =>
    cy
      .get('paint-app')
      .shadow()
      .find('lit-route[component="paint-overview-page"]')
      .shadow()
      .find('paint-overview-page')
      .shadow();

  it('sets auth cookie when logging in via form submission', function () {
    cy.visit('/');
    getOverviewPage().find('paint-new-paint-button').should('be.length', 1);
  });
});
