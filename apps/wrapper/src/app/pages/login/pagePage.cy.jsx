import React from 'react'
import Page from './page'
import { Provider } from 'react-redux'
import { store } from 'src/app/redux/store'
describe('<Page />', () => {
  
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <Provider store={store}>
        <Page />
      </Provider>

    )   
  })
})