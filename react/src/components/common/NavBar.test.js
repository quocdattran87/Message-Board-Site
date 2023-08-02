// Adapted from week 9 tutorial

import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { getTestLoggedInUser } from '../../data/testRepository'
import NavBar from './NavBar'

// Global data for tests.
let loggedInUser
let container

// Runs once before tests, here global test data is initialised.
beforeAll(() => {
    loggedInUser = getTestLoggedInUser()
})

// Runs before each test, here the Users component is rendered and the container is stored.
beforeEach(() => {
    const utils = render(
    <BrowserRouter>
        <NavBar loggedInUser={loggedInUser} test={true} />,
    </BrowserRouter>)
    container = utils.container
})

test('Render navbar', () => {
    expect(container).toBeInTheDocument()
})

test('Test logout button works', () => {
    let button = screen.getByRole('button', {name: /Logout/i})
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    expect(global.window.location.pathname).toEqual('/logout')
})



