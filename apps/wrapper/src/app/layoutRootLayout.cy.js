import React from 'react'
import RootLayout from './layout'
import { Provider } from 'react-redux'; 
import { store } from './redux/store';



describe('<RootLayout />', () => {
  beforeEach(() => {
    cy.mount(
      <Provider store={store}>
        <RootLayout />
      </Provider>
    );
  });

  it('renders without errors', () => {
    cy.get('html').should('exist');
    cy.get('body').should('exist');
  });


  it('loads external scripts', () => {
    cy.get('script[src="./enketo-offline-fallback.js"]').should('exist');
    cy.get('script[src="./enketo-webform-edit.js"]').should('exist');
  });
});