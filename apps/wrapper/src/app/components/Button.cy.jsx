import React from 'react'
import Button from './Button'

describe('<Button />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Button
      text={"Sign In"}
      styles="w-80 lg:w-[70%] animate__animated animate__fadeInDown"
      onClick={()=>alert("Testing Done")}
    />)
  })
})