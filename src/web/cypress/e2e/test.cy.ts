describe('template spec', () => {
  it('renders the home page', () => {
    cy.visit('http://localhost:5173/');
  });
  it('renders the CS2 page', () => {
    cy.visit('http://localhost:5173/game/CS2');
  });
  it('renders the Valorant page', () => {
    cy.visit('http://localhost:5173/game/Valorant');
  });
  it('renders the Valorant Agent page', () => {
     cy.visit('http://localhost:5173/game/valorant/agents');
  });
  it('renders the Valorant Lineup page', () => {
     cy.visit('http://localhost:5173/game/valorant/lineups');
  });
  it('renders the Login page', () => {
    cy.visit('http://localhost:5173/login');
  });
  it('renders the Signup page', () => {
    cy.visit('http://localhost:5173/register');
  });
  it('renders the occupate user page', () => {
    cy.visit('http://localhost:5173/user/ooccupate');
  });
});