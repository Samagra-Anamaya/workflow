import React from 'react'
import GenericOdkForm from './page'
import { Provider } from 'react-redux'
import { store } from 'src/app/redux/store'
describe('<GenericOdkForm />', () => {
  it('renders', () => {
    cy.mount(
      <Provider store={store}>
        <GenericOdkForm params={{ slug: 'distress' }}/>
      </Provider>
    )
    cy.get('iframe').should('exist'); 
    cy.get('iframe').should('have.attr', 'src'); 
  })
  it('submits the form', () => {
    cy.mount(
      <Provider store={store}>
        <GenericOdkForm params={{ slug: 'distress' }} />
      </Provider>
    );
    cy.get('iframe').iframe(() => {
      cy.get('input[name="your-input-name"]').type('input text');
      cy.get('button[type="submit"]').click();
    });

    cy.get('.success-popup').should('exist');
  });

})