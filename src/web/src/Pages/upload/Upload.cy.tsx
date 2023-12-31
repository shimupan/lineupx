import React from 'react'
import Upload from './Upload'

describe('<Upload />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Upload />)
  })
})